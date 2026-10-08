/** Central site configuration used for metadata, sitemap and JSON-LD. */
export const siteConfig = {
  name: "Brand Directory",
  /** Set NEXT_PUBLIC_SITE_URL in production for correct canonical/OG URLs. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://brandsearch.example.com",
  description:
    "A searchable directory of the world's most recognisable brands: logos, brand colours, industries, headquarters and official links.",
  locale: "en_US",
} as const;

export function absoluteUrl(path = "/"): string {
  return new URL(path, siteConfig.url).toString();
}
