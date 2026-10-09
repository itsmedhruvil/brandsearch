import type { Brand } from "@/types/brand";

/** A partial brand, as returned by an enrichment provider. */
export type EnrichedBrand = Partial<Brand>;

/**
 * An enrichment provider resolves brand data for a registrable domain.
 * Providers are tried in order and their results merged; unavailable
 * providers (missing key) are skipped, so the app always runs.
 */
export interface BrandEnrichmentProvider {
  /** Stable identifier, also recorded as field provenance. */
  readonly name: string;
  /** False when the provider's credentials/feature flag are missing. */
  readonly enabled: boolean;
  /** Return partial brand data, or null when nothing could be resolved. */
  enrich(domain: string): Promise<EnrichedBrand | null>;
}
