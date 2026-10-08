import { brands as seed } from "@/data/brands";
import { CATEGORIES } from "./categories";
import type { Brand } from "@/types/brand";

/**
 * Data-access seam for the directory.
 *
 * Everything the UI needs goes through these functions, so moving from the
 * bundled seed to Postgres (Prisma/Drizzle) or a headless CMS is a single-file
 * change. Functions are synchronous today; swap the bodies for `await db...`
 * and make callers async when the data moves behind a network boundary.
 */

export type BrandSort = "name" | "founded" | "recent";

export interface BrandQuery {
  q?: string;
  category?: string;
  tag?: string;
  featured?: boolean;
  sort?: BrandSort;
  page?: number;
  pageSize?: number;
}

export interface BrandListResult {
  items: Brand[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CategoryFacet {
  slug: string;
  label: string;
  count: number;
}

export const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 60;

export function getAllBrands(): Brand[] {
  return seed;
}

export function getBrandBySlug(slug: string): Brand | undefined {
  return seed.find((brand) => brand.slug === slug);
}

export function getBrandSlugs(): string[] {
  return seed.map((brand) => brand.slug);
}

export function getFeaturedBrands(limit = 6): Brand[] {
  return seed.filter((brand) => brand.featured).slice(0, limit);
}

export function getRelatedBrands(brand: Brand, limit = 3): Brand[] {
  return seed
    .filter((b) => b.category === brand.category && b.slug !== brand.slug)
    .slice(0, limit);
}

/** Category list with brand counts, for the directory filter rail. */
export function getCategoryFacets(): CategoryFacet[] {
  const counts = new Map<string, number>();
  for (const brand of seed) {
    counts.set(brand.category, (counts.get(brand.category) ?? 0) + 1);
  }
  return CATEGORIES.map((c) => ({ ...c, count: counts.get(c.slug) ?? 0 }));
}

/** All unique tags, most frequent first. */
export function getPopularTags(limit = 20): string[] {
  const counts = new Map<string, number>();
  for (const brand of seed) {
    for (const tag of brand.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([tag]) => tag);
}

function matches(brand: Brand, query: string): boolean {
  const haystack = [
    brand.name,
    brand.domain,
    brand.industry,
    brand.tagline,
    brand.description,
    brand.headquarters ?? "",
    brand.country ?? "",
    ...brand.tags,
  ]
    .join(" ")
    .toLowerCase();

  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

function sortBrands(items: Brand[], sort: BrandSort): Brand[] {
  switch (sort) {
    case "founded":
      return items.sort((a, b) => (a.founded ?? 9999) - (b.founded ?? 9999));
    case "recent":
      return items.sort(
        (a, b) =>
          b.updatedAt.localeCompare(a.updatedAt) || a.name.localeCompare(b.name),
      );
    case "name":
    default:
      return items.sort((a, b) => a.name.localeCompare(b.name));
  }
}

export function listBrands(query: BrandQuery = {}): BrandListResult {
  const pageSize = Math.min(
    Math.max(Math.floor(query.pageSize ?? DEFAULT_PAGE_SIZE), 1),
    MAX_PAGE_SIZE,
  );
  const page = Math.max(Math.floor(query.page ?? 1), 1);

  let items = [...seed];

  if (query.category) items = items.filter((b) => b.category === query.category);
  if (query.tag) items = items.filter((b) => b.tags.includes(query.tag as string));
  if (query.featured) items = items.filter((b) => b.featured);

  const q = query.q?.trim();
  if (q) items = items.filter((b) => matches(b, q));

  items = sortBrands(items, query.sort ?? "name");

  const total = items.length;
  const totalPages = Math.max(Math.ceil(total / pageSize), 1);
  const start = (page - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    total,
    page,
    pageSize,
    totalPages,
  };
}
