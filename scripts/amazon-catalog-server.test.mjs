import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createCatalogClient, createCatalogServer } from './amazon-catalog-server.mjs';

const env = {
  AMAZON_CREATORS_CREDENTIAL_ID: 'test-id-never-public',
  AMAZON_CREATORS_CREDENTIAL_SECRET: 'test-secret-never-public',
  AMAZON_CREATORS_CREDENTIAL_VERSION: '3.1'
};
const items = [{ asin: 'B08MWSBKB6', category: 'Boxing gloves' }];
const record = {
  asin: 'B08MWSBKB6',
  detailPageURL: 'https://www.amazon.com/dp/B08MWSBKB6?tag=anthonycolonn-20&linkCode=ogi&th=1',
  itemInfo: { title: { displayValue: 'Training gloves' } },
  images: { primary: { large: { url: 'https://m.media-amazon.com/images/I/example.jpg', width: 500, height: 500 } } }
};
const ok = data => ({ ok: true, status: 200, json: async () => data });

test('coalesces calls, preserves attribution, caches URLs only, removes expired cache', async () => {
  let time = 1_000_000, calls = [], fail = false;
  const fetchImpl = async (url, options) => {
    calls.push({ url, options });
    if (fail && !url.includes('/auth/')) return { ok: false, status: 403, json: async () => ({ reason: 'AssociateNotEligible', message: env.AMAZON_CREATORS_CREDENTIAL_SECRET }) };
    return url.includes('/auth/') ? ok({ access_token: 'test-bearer-never-public', expires_in: 3600 }) : ok({ itemsResult: { items: [record] } });
  };
  const client = createCatalogClient({ env, items, now: () => time, fetchImpl });
  const [a,b] = await Promise.all([client.getCatalog(), client.getCatalog()]);
  assert.deepEqual(a,b); assert.equal(calls.length,2);
  assert.equal(a.items[0].url, record.detailPageURL);
  assert.equal(a.items[0].image.url, record.images.primary.large.url);
  assert.equal(JSON.stringify(a).includes('never-public'),false);
  assert.equal(JSON.stringify(client.status()).includes('never-public'),false);
  await client.getCatalog(); assert.equal(calls.length,2);
  assert.ok(Date.parse(a.expiresAt) - time < 24*60*60*1000);
  time = Date.parse(a.expiresAt) + 1; fail = true;
  await assert.rejects(client.getCatalog(), { message:'associate_not_eligible' });
  assert.equal(client.status().cachedItems,0);
  const count = calls.length;
  await assert.rejects(client.getCatalog(), { message:'associate_not_eligible' });
  assert.equal(calls.length,count); // Error cooldown prevents upstream request storms.
});

test('does not authenticate without required values; rejects untrusted image/link URLs', async () => {
  const missing = createCatalogClient({env:{},items,fetchImpl:()=>{throw new Error('must not fetch')}});
  await assert.rejects(missing.getCatalog(), { message:'credentials_missing' });
  for (const poisoned of [
    { ...record, detailPageURL:'https://example.com/?tag=anthonycolonn-20' },
    { ...record, detailPageURL:'https://www.amazon.com/dp/B08MWSBKB6?tag=someone-else-20' },
    { ...record, images:{primary:{large:{url:'https://example.com/product.jpg'}}} }
  ]) {
    const client = createCatalogClient({env,items,fetchImpl:async url=>url.includes('/auth/')?ok({access_token:'test',expires_in:3600}):ok({itemsResult:{items:[poisoned]}})});
    await assert.rejects(client.getCatalog(), {message:'amazon_no_items'});
  }
});

test('distinguishes a rejected credential from product API eligibility without exposing Amazon error text', async () => {
  const client = createCatalogClient({env,items,fetchImpl:async()=>({ok:false,status:400,json:async()=>({error:'invalid_client',error_description:env.AMAZON_CREATORS_CREDENTIAL_SECRET})})});
  await assert.rejects(client.getCatalog(),{message:'amazon_credentials_rejected'});
  assert.equal(client.status().lastError,'amazon_credentials_rejected');
  assert.equal(JSON.stringify(client.status()).includes(env.AMAZON_CREATORS_CREDENTIAL_SECRET),false);
});

test('HTTP endpoint uses no-store, restricts origins, and exposes no credentials', async t => {
  const client = createCatalogClient({env:{},items});
  const server = createCatalogServer(client);
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  t.after(()=>new Promise(r=>server.close(r)));
  const base = `http://127.0.0.1:${server.address().port}`;
  const health = await fetch(base+'/health'); assert.equal(health.status,200);
  assert.equal(health.headers.get('cache-control'),'no-store');
  const data = await health.json(); assert.equal(data.configured,false);
  const blocked = await fetch(base+'/api/catalog',{headers:{Origin:'https://other.example'}}); assert.equal(blocked.status,403);
  const catalog = await fetch(base+'/api/catalog',{headers:{Origin:'https://punchpgh.com'}});
  assert.equal(catalog.status,503);
  assert.equal(catalog.headers.get('access-control-allow-origin'),'https://punchpgh.com');
  assert.deepEqual(await catalog.json(),{error:'credentials_missing'});
});
