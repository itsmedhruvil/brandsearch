# Brand data sources & enrichment strategy

This document explains how the directory gets its data, which APIs to use,
and how to fill the gaps with scraping. It is the reference for the
`src/lib/brands/providers` layer.

## 1. Preferred: official / licensed APIs

| Provider | Fields | Auth | Cost | Fit |
| --- | --- | --- | --- | --- |
| **Brandfetch** | logo, colors, fonts, images, company profile (by domain or ticker) | `Bearer` token (`BRANDFETCH_CLIENT_ID`) | Free tier → paid | **Primary source** |
| **Logo.dev** | logo by domain | `NEXT_PUBLIC_LOGO_DEV_TOKEN` | Cheap | Logo fallback |
| **Clearbit Logo API** (`logo.clearbit.com/{domain}`) | logo | none (legacy) | — | ⚠️ HubSpot-owned, free endpoint being retired — do **not** depend on it |
| **Crunchbase API** | funding, investors, HQ, headcount | API key | Enterprise | Paid enrichment |
| **Wikidata (SPARQL)** | founded, HQ, industry, official site, logo | none | Free | **Free facts + logos** |
| **Wikipedia REST API** | summary text, thumbnail | none | Free | Descriptions |
| **SEC EDGAR** (US) / **Companies House** (UK) / **OpenCorporates** | legal registration | varies | Free / commercial | Verify entities |
| **Google Knowledge Graph** | entity facts | API key | Quota-limited | Optional |
| **TheirStack / Harmonic / The Companies API** | bulk startup data | API key | Paid | Seed datasets |

**Recommended stack:** `Wikidata` (free facts) → `Brandfetch` (rich brand
assets) → `Logo.dev` (logo fallback). All three are already wired in
`src/lib/brands/providers`.

Set the environment variables below to enable a provider; providers that are
not configured are skipped automatically (the app still runs on seed data):

```
BRANDFETCH_CLIENT_ID=
NEXT_PUBLIC_LOGO_DEV_TOKEN=
```

## 2. Scraping (for the gaps)

Always prefer an API. Scrape only what you can't license.

### Structured data first
Do not parse the whole DOM. Extract, in order:
1. `schema.org` **JSON-LD** — `<script type="application/ld+json">` (Organization/Corporation).
2. **OpenGraph** — `og:title`, `og:site_name`, `og:description`, `og:image`.
3. **Icons** — `<link rel="apple-touch-icon">`, `<link rel="icon">`.
4. **`manifest.json`** — icon list **and** `theme_color` (free brand color).
5. `<meta name="theme-color">`.

Logo discovery order: manifest icons → apple-touch-icon → og:image → favicon →
in-page `<img>` heuristics (largest square asset near the header).

### Rendering tiers
- **Static HTML** → `fetch` + Cheerio (`node-html-parser` is lighter). Good for ~80% of sites.
- **JS-rendered** → headless browser: **Playwright** (preferred) or Puppeteer.
- **Heavy/anti-bot** → managed rendering (Browserless, ScrapingBee) or the official API.

### Rules of engagement (non-negotiable)
- Respect `robots.txt`, the site's ToS, and `Crawl-delay`.
- Rate-limit (1 req/domain/sec max), retry with exponential backoff, cache results in your DB.
- Identify your crawler with a descriptive `User-Agent` + contact URL.
- Logos are **trademarks**: use nominative/informational use only; never imply endorsement.
- Personal data ⇒ GDPR applies. Don't store people, only companies.
- Prefer `HEAD`/conditional requests and respect `ETag`/`Last-Modified`.

## 3. Where this lives in the codebase

```
src/lib/brands/
  providers/brandfetch.ts   # Brandfetch adapter
  providers/wikidata.ts     # Wikidata SPARQL adapter
  providers/local.ts        # curated seed (no key required)
  providers/index.ts        # registry + resolution order
  scrape.ts                 # structured-data scraper (fetch, no browser)
scripts/enrich.mjs          # CLI: enrich the dataset and write JSON
```

`scripts/enrich.mjs` is a dependency-free Node script:

```bash
node scripts/enrich.mjs nike.com stripe.com    # prints extracted brand JSON
```

For JS-heavy sites, drop in Playwright and feed the resulting HTML to
`extractBrandFromHtml()` — the parsing logic does not care how the HTML
arrived.

## 4. Production checklist

- [ ] Move the dataset from `src/data` to Postgres (Prisma/Drizzle) — the
      repository interface in `src/lib/brands/repository.ts` is the seam.
- [ ] Add a scheduled sync (cron/queue) that re-enriches brands and refreshes logos.
- [ ] Put a CDN cache in front of logos and proxy them (don't hotlink at scale).
- [ ] Add full-text search (Typesense/Meilisearch/Algolia) once > ~5k brands.
- [ ] Track data provenance per field (`source`) and honour logo takedown requests.
