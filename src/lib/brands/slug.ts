/**
 * Convert an arbitrary string into a URL-safe slug.
 * "Levi's" -> "levi-s", "H&M" -> "h-and-m", "A Coruña" -> "a-coruna"
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
