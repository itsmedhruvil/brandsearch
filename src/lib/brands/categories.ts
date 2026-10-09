export interface Category {
  slug: string;
  label: string;
}

/**
 * Canonical category registry. Category slugs stored on a Brand must match an
 * entry here; the directory derives its filter UI from this list.
 */
export const CATEGORIES: Category[] = [
  { slug: "technology", label: "Technology" },
  { slug: "fashion", label: "Fashion & Apparel" },
  { slug: "food-beverage", label: "Food & Beverage" },
  { slug: "automotive", label: "Automotive" },
  { slug: "finance", label: "Financial Services" },
  { slug: "retail", label: "Retail & E-commerce" },
  { slug: "media", label: "Media & Entertainment" },
  { slug: "health", label: "Health & Beauty" },
  { slug: "travel", label: "Travel & Hospitality" },
  { slug: "luxury", label: "Luxury Goods" },
];

const CATEGORY_MAP = new Map(CATEGORIES.map((c) => [c.slug, c]));

export function getCategory(slug: string): Category | undefined {
  return CATEGORY_MAP.get(slug);
}

export function categoryLabel(slug: string): string {
  return CATEGORY_MAP.get(slug)?.label ?? slug;
}
