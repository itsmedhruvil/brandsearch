import type { MetadataRoute } from "next";
import { getBrandSlugs } from "@/lib/brands/repository";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/brands",
    "/about",
    "/blog",
    "/contact",
  ].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const brandRoutes: MetadataRoute.Sitemap = getBrandSlugs().map((slug) => ({
    url: `${siteConfig.url}/brands/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...brandRoutes];
}
