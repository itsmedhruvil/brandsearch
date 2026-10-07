import type { BrandEnrichmentProvider, EnrichedBrand } from "./types";

/**
 * Wikidata adapter — free, key-less facts (inception, HQ, industry, country,
 * employees) resolved by matching the organisation's official website (P856).
 * https://query.wikidata.org
 */
const SPARQL_ENDPOINT = "https://query.wikidata.org/sparql";

type NextFetchInit = RequestInit & { next?: { revalidate?: number } };

interface SparqlBinding {
  value: string;
}
interface SparqlResponse {
  results?: {
    bindings?: Record<string, SparqlBinding | undefined>[];
  };
}

function buildQuery(domain: string): string {
  return `SELECT ?item ?itemLabel ?inception ?headquartersLabel ?industryLabel ?countryLabel ?employees WHERE {
  ?item wdt:P856 ?website .
  FILTER(CONTAINS(LCASE(STR(?website)), "${domain}"))
  OPTIONAL { ?item wdt:P571 ?inception. }
  OPTIONAL { ?item wdt:P159 ?headquarters. }
  OPTIONAL { ?item wdt:P452 ?industry. }
  OPTIONAL { ?item wdt:P17 ?country. }
  OPTIONAL { ?item wdt:P1128 ?employees. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
LIMIT 1`;
}

function year(value?: string): number | undefined {
  if (!value) return undefined;
  const match = /(-?\d{4})/.exec(value);
  return match ? Number(match[1]) : undefined;
}

export function mapWikidata(data: SparqlResponse): EnrichedBrand | null {
  const row = data.results?.bindings?.[0];
  if (!row) return null;

  return {
    name: row.itemLabel?.value,
    founded: year(row.inception?.value),
    headquarters: row.headquartersLabel?.value,
    industry: row.industryLabel?.value,
    country: row.countryLabel?.value,
    employees: row.employees?.value,
  };
}

export const wikidataProvider: BrandEnrichmentProvider = {
  name: "wikidata",
  enabled: true,
  async enrich(domain) {
    try {
      const url = `${SPARQL_ENDPOINT}?format=json&query=${encodeURIComponent(
        buildQuery(domain),
      )}`;
      const res = await fetch(url, {
        headers: {
          Accept: "application/sparql-results+json",
          // Wikimedia asks that automated clients identify themselves.
          "User-Agent": "brand-directory/1.0 (+https://example.com/bot)",
        },
        next: { revalidate: 60 * 60 * 24 * 7 },
      } as NextFetchInit);
      if (!res.ok) return null;
      return mapWikidata((await res.json()) as SparqlResponse);
    } catch {
      return null;
    }
  },
};
