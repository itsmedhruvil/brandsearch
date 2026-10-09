import type { BrandColor, BrandSocial } from "@/types/brand";
import type { EnrichedBrand } from "./providers/types";

/**
 * Structured-data scraper.
 *
 * Extraction is deliberately *structured-data first* (schema.org JSON-LD,
 * OpenGraph, icons, theme-color) rather than DOM scraping — it is far more
 * robust and respects how sites publish data for machines. It takes raw HTML
 * as input, so it works with a plain `fetch` for static sites or with the HTML
 * produced by a headless browser (Playwright) for JS-rendered sites.
 *
 * See docs/brand-data-sources.md for the legal/ethical checklist.
 */

export interface ScrapedBrand extends EnrichedBrand {
  /** Ordered logo/image candidates discovered on the page. */
  imageCandidates: string[];
}

const USER_AGENT =
  "brand-directory-bot/1.0 (+https://example.com/bot; contact: ops@example.com)";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function metaContent(html: string, key: string): string | undefined {
  const k = escapeRegExp(key);
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${k}["'][^>]*content=["']([^"']*)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${k}["']`,
      "i",
    ),
  ];
  for (const re of patterns) {
    const match = re.exec(html);
    if (match) return decodeEntities(match[1]);
  }
  return undefined;
}

function linkHrefs(html: string, rel: string): string[] {
  const tagRe = new RegExp(
    `<link[^>]+rel=["'][^"']*${escapeRegExp(rel)}[^"']*["'][^>]*>`,
    "gi",
  );
  const hrefs: string[] = [];
  for (const tag of html.match(tagRe) ?? []) {
    const href = /href=["']([^"']+)["']/i.exec(tag);
    if (href) hrefs.push(decodeEntities(href[1]));
  }
  return hrefs;
}

function resolveUrl(href: string, baseUrl: string): string | undefined {
  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return undefined;
  }
}

interface JsonLdNode {
  "@type"?: string | string[];
  name?: string;
  description?: string;
  logo?: string | { url?: string };
  sameAs?: string[];
  url?: string;
}

function jsonLdNodes(html: string): JsonLdNode[] {
  const nodes: JsonLdNode[] = [];
  const re =
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1].trim());
      const queue = Array.isArray(parsed)
        ? parsed
        : parsed["@graph"]
          ? parsed["@graph"]
          : [parsed];
      for (const node of queue)
        if (node && typeof node === "object") nodes.push(node);
    } catch {
      /* ignore malformed JSON-LD blocks */
    }
  }
  return nodes;
}

function isOrganization(node: JsonLdNode): boolean {
  const type = node["@type"];
  const types = Array.isArray(type) ? type : type ? [type] : [];
  return types.some((t) =>
    /organization|corporation|brand|localbusiness/i.test(String(t)),
  );
}

function socialsFromSameAs(sameAs?: string[]): BrandSocial | undefined {
  if (!sameAs?.length) return undefined;
  const socials: BrandSocial = {};
  for (const url of sameAs) {
    if (/twitter\.com|x\.com/i.test(url)) socials.twitter = url;
    else if (/linkedin\.com/i.test(url)) socials.linkedin = url;
    else if (/instagram\.com/i.test(url)) socials.instagram = url;
    else if (/facebook\.com/i.test(url)) socials.facebook = url;
    else if (/youtube\.com|youtu\.be/i.test(url)) socials.youtube = url;
    else if (/github\.com/i.test(url)) socials.github = url;
  }
  return Object.keys(socials).length ? socials : undefined;
}

/** Parse a page's structured data into a partial brand. Pure & synchronous. */
export function extractBrandFromHtml(
  html: string,
  baseUrl: string,
): ScrapedBrand {
  const nodes = jsonLdNodes(html);
  const org = nodes.find(isOrganization);

  const logoNode = org?.logo;
  const jsonLdLogo = typeof logoNode === "string" ? logoNode : logoNode?.url;

  const imageCandidates = [
    jsonLdLogo,
    metaContent(html, "og:image"),
    ...linkHrefs(html, "apple-touch-icon"),
    ...linkHrefs(html, "icon"),
  ]
    .filter((value): value is string => Boolean(value))
    .map((href) => resolveUrl(href, baseUrl))
    .filter((url): url is string => Boolean(url));

  const themeColor = metaContent(html, "theme-color");
  const colors: BrandColor[] = themeColor
    ? [{ hex: themeColor, source: "theme-color" }]
    : [];

  return {
    name:
      org?.name ??
      metaContent(html, "og:site_name") ??
      metaContent(html, "og:title"),
    description: metaContent(html, "og:description") ?? org?.description,
    logo: imageCandidates[0],
    imageCandidates,
    colors: colors.length ? colors : undefined,
    socials: socialsFromSameAs(org?.sameAs),
  };
}

/**
 * Minimal robots.txt check: returns false only when the default user-agent is
 * disallowed from the root. Good enough as a guard; production crawlers should
 * use a full robots parser (e.g. `robots-parser`).
 */
export function robotsAllows(robotsTxt: string): boolean {
  const lines = robotsTxt.split(/\r?\n/).map((l) => l.trim().toLowerCase());
  let inStarBlock = false;
  for (const line of lines) {
    if (line.startsWith("user-agent:")) {
      inStarBlock = line.slice(11).trim() === "*";
    } else if (inStarBlock && line.startsWith("disallow:")) {
      if (line.slice(9).trim() === "/") return false;
    }
  }
  return true;
}

/**
 * Fetch a URL and extract brand data. For JS-heavy sites, fetch the HTML with
 * Playwright and pass it to `extractBrandFromHtml` directly instead.
 */
export async function scrapeBrand(
  url: string,
  { timeoutMs = 10000 }: { timeoutMs?: number } = {},
): Promise<ScrapedBrand | null> {
  const base = new URL(url);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const robots = await fetch(`${base.origin}/robots.txt`, {
      signal: controller.signal,
    }).catch(() => null);
    if (robots?.ok && !robotsAllows(await robots.text())) return null;

    const res = await fetch(base.toString(), {
      headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
      signal: controller.signal,
    });
    if (!res.ok) return null;
    return extractBrandFromHtml(await res.text(), base.toString());
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
