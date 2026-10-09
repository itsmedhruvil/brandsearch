import { getAllBrands } from "../repository";
import type { BrandEnrichmentProvider } from "./types";

/**
 * Zero-dependency provider backed by the bundled dataset. Always enabled, so
 * it acts as the ultimate fallback and the offline development source.
 */
export const localProvider: BrandEnrichmentProvider = {
  name: "local",
  enabled: true,
  async enrich(domain) {
    const brand = getAllBrands().find((b) => b.domain === domain);
    return brand ? { ...brand } : null;
  },
};
