/**
 * Domain model for the brand directory.
 *
 *  - `Brand`     : full brand profile used by the /brands directory + detail pages.
 *  - `BrandLogo` : lightweight logo-strip item used on the homepage.
 */

/** A colour taken from the brand's palette. */
export interface BrandColor {
  hex: string;
  /** Provenance of the value, e.g. "seed" | "brandfetch" | "manifest". */
  source?: string;
}

export interface BrandSocial {
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  github?: string;
}

export interface Brand {
  id: string;
  /** URL-safe unique key used by /brands/[slug]. */
  slug: string;
  name: string;
  /** Registrable domain — the key every enrichment provider works from. */
  domain: string;
  /** Fully-qualified website URL. */
  website: string;
  tagline: string;
  description: string;
  /** Category slug (matches an entry in the category registry). */
  category: string;
  /** Human-readable industry label. */
  industry: string;
  tags: string[];
  /** Remote logo URL (see src/lib/brands/logo.ts for the fallback chain). */
  logo: string;
  colors: BrandColor[];
  founded?: number;
  headquarters?: string;
  country?: string;
  employees?: string;
  socials?: BrandSocial;
  featured?: boolean;
  /** ISO timestamp of the last successful enrichment/sync. */
  updatedAt: string;
}

/** Lightweight logo-strip item (homepage "trusted by" row). */
export interface BrandLogo {
  id: number;
  name: string;
  href: string;
  image: string;
  imageLight?: string;
}
