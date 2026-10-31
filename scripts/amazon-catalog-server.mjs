// Render Node web service. Never place credentials in frontend JavaScript.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const TTL = 12 * 60 * 60 * 1000;
const RETRY_DELAY = 5 * 60 * 1000;
const REQUIRED = ['AMAZON_CREATORS_CREDENTIAL_ID', 'AMAZON_CREATORS_CREDENTIAL_SECRET', 'AMAZON_CREATORS_CREDENTIAL_VERSION'];
const TOKEN_ENDPOINTS = {
  '3.1': 'https://api.amazon.com/auth/o2/token',
  '3.2': 'https://api.amazon.co.uk/auth/o2/token',
  '3.3': 'https://api.amazon.co.jp/auth/o2/token'
};
const RESOURCES = ['images.primary.large', 'itemInfo.title'];

class CatalogError extends Error {
  constructor(code) { super(code); this.code = code; }
}

function errorCode(status, body) {
  const reasons = [body?.reason, ...(body?.errors || []).map(e => e.reason || e.code)];
  if (reasons.includes('AssociateNotEligible')) return 'associate_not_eligible';
  if (status === 401 || status === 403) return 'amazon_access_denied';
  if (status === 429) return 'amazon_rate_limited';
  return 'amazon_unavailable';
}

function publicItem(item, category, tag) {
  try {
    const image = item?.images?.primary?.large;
    const imageUrl = new URL(image?.url);
    const url = new URL(item.detailPageURL);
    const imageHost = imageUrl.hostname.toLowerCase();
    if (!/^[A-Z0-9]{10}$/.test(item.asin) || typeof item?.itemInfo?.title?.displayValue !== 'string' || !item.itemInfo.title.displayValue) return null;
    if (url.protocol !== 'https:' || !['amazon.com', 'www.amazon.com'].includes(url.hostname) || url.searchParams.get('tag') !== tag) return null;
    if (imageUrl.protocol !== 'https:' || !/(^|\.)(media-amazon\.com|ssl-images-amazon\.com|images-amazon\.com)$/.test(imageHost)) return null;
    return {
      asin: item.asin,
      category,
      title: item.itemInfo.title.displayValue,
      // Retain Amazon's complete attribution URL; never proxy/download the image.
      url: item.detailPageURL,
      image: { url: image.url, width: image.width, height: image.height }
    };
  } catch { return null; }
}

export function createCatalogClient({ env = process.env, items, fetchImpl = fetch, now = Date.now, pause = ms => new Promise(r => setTimeout(r, ms)) }) {
  const config = Object.fromEntries(REQUIRED.map(k => [k, String(env[k] || '').trim()]));
  const missing = REQUIRED.filter(k => !config[k]);
  const tag = String(env.AMAZON_ASSOCIATE_TAG || 'anthonycolonn-20').trim();
  const tokenEndpoint = TOKEN_ENDPOINTS[config.AMAZON_CREATORS_CREDENTIAL_VERSION];
  const unique = [...new Map(items.map(i => [i.asin, i])).values()];
  if (!unique.length || unique.length > 50 || unique.some(i => !/^[A-Z0-9]{10}$/.test(i.asin))) throw new Error('Invalid catalog ASIN configuration');
  let token, tokenExpiresAt = 0, tokenPending, cached, expiryTimer, pending, lastCode = null, retryAt = 0;

  async function post(url, body, headers = {}, stage = 'catalog') {
    let response, json;
    try {
      response = await fetchImpl(url, {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(body), signal: AbortSignal.timeout(15000), redirect: 'error'
      });
      json = await response.json();
    } catch { throw new CatalogError('amazon_unavailable'); }
    if (!response.ok) {
      const code = stage === 'auth' && [400, 401, 403].includes(response.status)
        ? 'amazon_credentials_rejected' : errorCode(response.status, json);
      throw new CatalogError(code);
    }
    return json;
  }

  async function accessToken() {
    if (token && now() < tokenExpiresAt) return token;
    if (tokenPending) return tokenPending;
    tokenPending = (async () => {
      const body = await post(tokenEndpoint, {
        grant_type: 'client_credentials',
        client_id: config.AMAZON_CREATORS_CREDENTIAL_ID,
        client_secret: config.AMAZON_CREATORS_CREDENTIAL_SECRET,
        scope: 'creatorsapi::default'
      }, {}, 'auth');
      const lifetime = Math.min(Number(body.expires_in) || 0, 3600);
      if (typeof body.access_token !== 'string' || lifetime <= 60) throw new CatalogError('amazon_access_denied');
      token = body.access_token;
      tokenExpiresAt = now() + (lifetime - 60) * 1000;
      return token;
    })();
    try { return await tokenPending; } finally { tokenPending = undefined; }
  }

  async function refresh() {
    const fetchedAt = now();
    const bearer = await accessToken();
    const found = new Map();
    for (let offset = 0; offset < unique.length; offset += 10) {
      if (offset) await pause(1100); // Stay below the initial one-request/second limit.
      const batch = unique.slice(offset, offset + 10);
      const data = await post('https://creatorsapi.amazon/catalog/v1/getItems', {
        itemIds: batch.map(i => i.asin), itemIdType: 'ASIN', marketplace: 'www.amazon.com',
        partnerTag: tag, resources: RESOURCES
      }, { Authorization: `Bearer ${bearer}`, 'x-marketplace': 'www.amazon.com' });
      for (const item of data?.itemsResult?.items || []) {
        const source = batch.find(i => i.asin === item.asin);
        const safe = source && publicItem(item, source.category, tag);
        if (safe) found.set(item.asin, safe);
      }
      if (!found.size && data?.errors?.length) throw new CatalogError(errorCode(403, data));
    }
    if (!found.size) throw new CatalogError('amazon_no_items');
    // Cache URL strings and text in memory only, for 12 hours (not image bytes).
    // Expired data is removed, never served stale when Amazon is unavailable.
    const expiresAt = fetchedAt + TTL;
    if (now() >= expiresAt) throw new CatalogError('amazon_unavailable');
    cached = {
      fetchedAt: new Date(fetchedAt).toISOString(), expiresAt: new Date(expiresAt).toISOString(),
      items: unique.map(i => found.get(i.asin)).filter(Boolean),
      missingAsins: unique.filter(i => !found.has(i.asin)).map(i => i.asin),
      disclaimer: "CERTAIN CONTENT THAT APPEARS ON THIS SITE COMES FROM AMAZON. THIS CONTENT IS PROVIDED 'AS IS' AND IS SUBJECT TO CHANGE OR REMOVAL AT ANY TIME."
    };
    clearTimeout(expiryTimer);
    expiryTimer = setTimeout(() => { cached = undefined; }, Math.max(0, expiresAt - now()));
    expiryTimer.unref?.();
    lastCode = null; retryAt = 0;
    return cached;
  }

  function status() {
    if (cached && now() >= Date.parse(cached.expiresAt)) cached = undefined;
    return {
      service: 'punchpgh-amazon-catalog', configured: !missing.length && Boolean(tokenEndpoint),
      missingVariables: missing, credentialVersionSupported: Boolean(tokenEndpoint),
      configuredItems: unique.length, cachedItems: cached?.items.length || 0,
      lastError: lastCode, retryAfter: retryAt > now() ? new Date(retryAt).toISOString() : null
    };
  }

  async function getCatalog() {
    const state = status();
    if (!state.configured) throw new CatalogError(missing.length ? 'credentials_missing' : 'credential_version_unsupported');
    if (cached) return cached;
    if (pending) return pending;
    if (now() < retryAt) throw new CatalogError(lastCode || 'amazon_unavailable');
    pending = refresh().catch(e => {
      token = undefined; tokenExpiresAt = 0;
      lastCode = e instanceof CatalogError ? e.code : 'amazon_unavailable';
      retryAt = now() + RETRY_DELAY;
      throw new CatalogError(lastCode);
    });
    try { return await pending; } finally { pending = undefined; }
  }
  return { getCatalog, status };
}

export function createCatalogServer(client, allowedOrigins = ['https://punchpgh.com', 'https://www.punchpgh.com']) {
  return createServer(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.setHeader('Vary', 'Origin');
    const origin = req.headers.origin;
    if (origin && !allowedOrigins.includes(origin)) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'origin_not_allowed' }));
    }
    if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405, { Allow: 'GET, HEAD' }); return res.end();
    }
    let path;
    try { path = new URL(req.url, 'http://localhost').pathname; } catch { res.writeHead(400); return res.end(); }
    if (!['/', '/health', '/api/catalog'].includes(path)) { res.writeHead(404); return res.end(); }
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    if (req.method === 'HEAD') { res.writeHead(200); return res.end(); }
    if (path !== '/api/catalog') return res.end(JSON.stringify(client.status()));
    try { res.end(JSON.stringify(await client.getCatalog())); }
    catch (e) {
      const safeCode = e instanceof CatalogError ? e.code : 'amazon_unavailable';
      res.writeHead(503, { 'Retry-After': '300' });
      res.end(JSON.stringify({ error: safeCode }));
    }
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const items = JSON.parse(await readFile(new URL('./amazon-catalog-items.json', import.meta.url), 'utf8'));
  const client = createCatalogClient({ items });
  const server = createCatalogServer(client);
  server.listen(Number(process.env.PORT) || 10000, '0.0.0.0', () => console.log('PUNCH Amazon catalog service listening; secrets are never logged.'));
  process.on('SIGTERM', () => server.close(() => process.exit(0)));
}
