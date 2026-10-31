# PUNCH Amazon catalog service

The live website is static. This separate Node web service holds Amazon credentials on the server and returns only product titles, tagged Amazon detail links, and Amazon-hosted image URLs. It never downloads or proxies product image bytes.

## Render setup

Create a **Web Service**, not a Static Site or Private Service, from `colonnamedia/PUNCH-FITNESS-PGH-NEW-2026`:

| Setting | Value |
| --- | --- |
| Name | `punchpgh-amazon-catalog` |
| Branch | `main` |
| Runtime | Node |
| Root Directory | Leave blank |
| Build Command | `node --check scripts/amazon-catalog-server.mjs` |
| Start Command | `node scripts/amazon-catalog-server.mjs` |
| Health Check Path | `/health` |
| Instance | Free for the initial eligibility test |

The Free instance sleeps after inactivity and is for this initial test only. Do not upgrade it to a paid instance without Anthony's approval. No changes to the existing `punchpgh` static service or its environment are needed.

After creating the service, open **punchpgh-amazon-catalog → Environment → Add Environment Variable**:

| Name | Value |
| --- | --- |
| `AMAZON_CREATORS_CREDENTIAL_ID` | Credential ID from Amazon's saved file |
| `AMAZON_CREATORS_CREDENTIAL_SECRET` | Secret from that file |
| `AMAZON_CREATORS_CREDENTIAL_VERSION` | Version exactly as Amazon provides it, such as `3.1` |
| `AMAZON_ASSOCIATE_TAG` | `anthonycolonn-20` |

Anthony enters the credential values directly in Render. Do not put them in GitHub, HTML, browser JavaScript, screenshots, logs, or chat. Save and deploy the environment changes. No `.env` file is committed.

## Verify

1. Use the exact URL Render assigns; do not assume the hostname from the requested service name.
2. `/health` reports `configured: true` when all three credential fields and a supported version are present. This does **not** establish Amazon access.
3. `/api/catalog` makes the real Amazon request. Successful results include exact ASINs, tagged product URLs, image URLs, and a 12-hour expiry. The initial file contains the 10 exact ASINs already present in the equipment batch.
4. A 503 with `associate_not_eligible` means Amazon denied eligibility. Amazon's page says credential eligibility review may take up to 48 hours and product access requires qualifying sales. `amazon_access_denied` may instead indicate credential or account permissions. These are sanitized diagnostic codes, not raw Amazon responses.
5. Once access succeeds, select exact ASINs for the remaining 40 search cards and add them to `scripts/amazon-catalog-items.json`. Review relevance before publishing. The endpoint supports up to 50 exact ASINs, requested in batches of 10.
6. Connect the equipment page only after checking the real response. Keep the approved two-column mobile layout and exclude in-gym-only PUNCH apparel from affiliate cards. Include the returned Amazon content disclaimer with any Amazon-derived text. Image links must go to their matching product.

## Cache and failure behavior

Only URL strings and product text are cached in process memory, for 12 hours. The endpoint sends `Cache-Control: no-store`. It removes expired entries and returns an error if refresh fails, rather than serving stale content. The frontend must also honor `expiresAt`, use no browser storage, and stop displaying Amazon content at expiry if a refresh fails. No prices or ratings are provided.

Concurrent requests share one refresh. OAuth tokens are reused until shortly before expiry. A failed refresh has a five-minute retry cooldown. Only the fixed, checked-in ASIN list is queried; the public endpoint cannot make arbitrary product requests. Requests from browser origins other than the PUNCH domains are blocked by CORS, but CORS is not authentication.

Run checks: `node --test scripts/amazon-catalog-server.test.mjs`.

## Official references

- Amazon authentication and GetItems: https://affiliate-program.amazon.com/creatorsapi/docs/en-us/get-started/using-curl
- Amazon image license/cache terms: https://affiliate-program.amazon.com/help/operating/policies
- Render environment variables: https://render.com/docs/configure-environment-variables
- Render Free instance limits: https://render.com/docs/free
