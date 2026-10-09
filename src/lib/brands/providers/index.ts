import { brandfetchProvider } from "./brandfetch";
import { localProvider } from "./local";
import type { BrandEnrichmentProvider, EnrichedBrand } from "./types";
import { wikidataProvider } from "./wikidata";

/**
 * Provider resolution order. Earlier providers win for any given field; later
 * ones only fill gaps. `local` is always last as the offline fallback.
 */
export const providers: BrandEnrichmentProvider[] = [
  brandfetchProvider,
  wikidataProvider,
  localProvider,
];

export function enabledProviders(): BrandEnrichmentProvider[] {
  return providers.filter((p) => p.enabled);
}

const isBlank = (value: unknown): boolean =>
  value === undefined ||
  value === null ||
  (typeof value === "string" && value.trim() === "") ||
  (Array.isArray(value) && value.length === 0);

/** Merge provider results in order; first non-empty value per field wins. */
export function mergeEnrichments(results: EnrichedBrand[]): EnrichedBrand {
  const merged: Record<string, unknown> = {};
  for (const result of results) {
    for (const [key, value] of Object.entries(result)) {
      if (isBlank(value)) continue;
      if (!isBlank(merged[key])) continue;
      merged[key] = value;
    }
  }
  return merged as EnrichedBrand;
}

/**
 * Resolve brand data for a domain by fanning out to every enabled provider.
 * Providers that throw or lack credentials are skipped, never fatal.
 */
export async function enrichDomain(domain: string): Promise<EnrichedBrand> {
  const settled = await Promise.all(
    enabledProviders().map((provider) =>
      provider.enrich(domain).catch(() => null),
    ),
  );
  return mergeEnrichments(
    settled.filter((r): r is EnrichedBrand => Boolean(r)),
  );
}

export type { BrandEnrichmentProvider, EnrichedBrand } from "./types";
