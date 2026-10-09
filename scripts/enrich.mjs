#!/usr/bin/env node
/**
 * Dependency-free brand enrichment CLI.
 *
 *   node scripts/enrich.mjs apple.com stripe.com nike.com
 *   node scripts/enrich.mjs --json apple.com        # raw JSON output
 *
 * It fetches each domain's home page and extracts structured brand data
 * (schema.org JSON-LD, OpenGraph, icons, theme-color), respecting robots.txt.
 *
 * NOTE: the canonical, typed implementation of this extraction lives in
 * `src/lib/brands/scrape.ts`. This script intentionally mirrors its field
 * priority so it can run without a TypeScript toolchain. For JS-rendered
 * sites, fetch the HTML with Playwright and reuse `extractBrandFromHtml`.
 */
const USER_AGENT =
  "brand-directory-bot/1.0 (+https://example.com/bot; contact: ops@example.com)";

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

function meta(html, key) {
  const k = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  for (const re of [
    new RegExp(`<meta[^>]+(?:property|name)=["']${k}["'][^>]*content=["']([^"']*)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${k}["']`, "i"),
  ]) {
    const m = re.exec(html);
    if (m) return decode(m[1]);
  }
  return undefined;
}

function linkHrefs(html, rel) {
  const re = new RegExp(`<link[^>]+rel=["'][^"']*${rel}[^"']*["'][^>]*>`, "gi");
  return (html.match(re) ?? [])
    .map((tag) => (/href=["']([^"']+)["']/i.exec(tag) || [])[1])
    .filter(Boolean);
}

function jsonLdNodes(html) {
  const out = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(m[1].trim());
      const list = Array.isArray(parsed) ? parsed : parsed["@graph"] ?? [parsed];
      for (const n of list) if (n && typeof n === "object") out.push(n);
    } catch {
      /* skip malformed block */
    }
  }
  return out;
}

const isOrg = (n) => {
  const t = n["@type"];
  return (Array.isArray(t) ? t : [t]).some((x) =>
    /organization|corporation|brand|localbusiness/i.test(String(x)),
  );
};

export function extractBrand(html, baseUrl) {
  const org = jsonLdNodes(html).find(isOrg);
  const resolve = (h) => {
    try {
      return new URL(h, baseUrl).toString();
    } catch {
      return undefined;
    }
  };
  const logoNode = org?.logo;
  const candidates = [
    typeof logoNode === "string" ? logoNode : logoNode?.url,
    meta(html, "og:image"),
    ...linkHrefs(html, "apple-touch-icon"),
    ...linkHrefs(html, "icon"),
  ]
    .filter(Boolean)
    .map(resolve)
    .filter(Boolean);

  const themeColor = meta(html, "theme-color");
  return {
    name: org?.name ?? meta(html, "og:site_name") ?? meta(html, "og:title"),
    description: meta(html, "og:description") ?? org?.description,
    logo: candidates[0],
    imageCandidates: [...new Set(candidates)],
    colors: themeColor ? [{ hex: themeColor, source: "theme-color" }] : [],
    sameAs: org?.sameAs ?? [],
  };
}

function robotsAllows(txt) {
  let star = false;
  for (const raw of txt.split(/\r?\n/)) {
    const line = raw.trim().toLowerCase();
    if (line.startsWith("user-agent:")) star = line.slice(11).trim() === "*";
    else if (star && line.startsWith("disallow:") && line.slice(9).trim() === "/") return false;
  }
  return true;
}

async function enrich(domain) {
  const url = /^https?:\/\//.test(domain) ? domain : `https://${domain}`;
  const base = new URL(url);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const robots = await fetch(`${base.origin}/robots.txt`, { signal: controller.signal }).catch(() => null);
    if (robots?.ok && !robotsAllows(await robots.text())) {
      return { domain, error: "disallowed by robots.txt" };
    }
    const res = await fetch(base.toString(), {
      headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
      signal: controller.signal,
    });
    if (!res.ok) return { domain, error: `HTTP ${res.status}` };
    return { domain, ...extractBrand(await res.text(), base.toString()) };
  } catch (err) {
    return { domain, error: String(err?.message ?? err) };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  const domains = args.filter((a) => !a.startsWith("--"));
  if (domains.length === 0) {
    console.error("usage: node scripts/enrich.mjs [--json] <domain> [domain...]");
    process.exit(1);
  }
  const results = await Promise.all(domains.map(enrich));
  console.log(json ? JSON.stringify(results, null, 2) : format(results));
}

function format(results) {
  return results
    .map((r) => {
      if (r.error) return `${r.domain}  ✗ ${r.error}`;
      const lines = [
        `${r.name ?? r.domain}  (${r.domain})`,
        r.description ? `  ${r.description}` : null,
        r.logo ? `  logo: ${r.logo}` : null,
        r.colors?.length ? `  colors: ${r.colors.map((c) => c.hex).join(", ")}` : null,
        r.sameAs?.length ? `  links: ${r.sameAs.join(", ")}` : null,
      ];
      return lines.filter(Boolean).join("\n");
    })
    .join("\n\n");
}

main();
