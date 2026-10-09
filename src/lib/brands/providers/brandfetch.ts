import type { BrandColor, BrandSocial } from "@/types/brand";
import type { BrandEnrichmentProvider, EnrichedBrand } from "./types";

/**
 * Brandfetch adapter — the primary enrichment source.
 * https://docs.brandfetch.com  (set BRANDFETCH_CLIENT_ID to enable)
 *
 * Returns logo, colours, description, company facts and social links for a
 * domain. Network calls are cached by Next's fetch cache for 24h.
 */
const CLIENT_ID = process.env.BRANDFETCH_CLIENT_ID;
const API_BASE = "https://api.brandfetch.io/v2/brands";

type NextFetchInit = RequestInit & { next?: { revalidate?: number } };

interface BfFormat {
  src?: string;
  size?: number;
}
interface BfLogo {
  type?: string;
  formats?: BfFormat[];
}
interface BfColor {
  hex?: string;
}
interface BfLink {
  name?: string;
  url?: string;
}
interface BfCompany {
  foundedYear?: number;
  employees?: number;
  location?: { city?: string; country?: string };
  industries?: { name?: string }[];
}
interface BfBrand {
  name?: string;
  description?: string;
  longDescription?: string;
  logos?: BfLogo[];
  colors?: BfColor[];
  company?: BfCompany;
  links?: BfLink[];
}

function pickLogo(logos?: BfLogo[]): string | undefined {
  const logo = logos?.find((l) => l.type === "logo") ?? logos?.[0];
  const formats = logo?.formats ?? [];
  const best = [...formats].sort((a, b) => (b.size ?? 0) - (a.size ?? 0))[0];
  return best?.src;
}

function pickSocials(links?: BfLink[]): BrandSocial | undefined {
  if (!links?.length) return undefined;
  const socials: BrandSocial = {};
  for (const link of links) {
    const name = link.name?.toLowerCase();
    if (!name || !link.url) continue;
    if (name === "twitter" || name === "x") socials.twitter = link.url;
    else if (name === "linkedin") socials.linkedin = link.url;
    else if (name === "instagram") socials.instagram = link.url;
    else if (name === "facebook") socials.facebook = link.url;
    else if (name === "youtube") socials.youtube = link.url;
    else if (name === "github") socials.github = link.url;
  }
  return Object.keys(socials).length ? socials : undefined;
}

export function mapBrandfetch(data: BfBrand): EnrichedBrand {
  const colors: BrandColor[] = (data.colors ?? [])
    .map((c) => c.hex)
    .filter((hex): hex is string => Boolean(hex))
    .map((hex) => ({ hex, source: "brandfetch" }));

  const company = data.company;
  const location = company?.location;
  const headquarters =
    [location?.city, location?.country].filter(Boolean).join(", ") || undefined;

  return {
    name: data.name,
    description: data.longDescription ?? data.description,
    logo: pickLogo(data.logos),
    colors: colors.length ? colors : undefined,
    industry: company?.industries?.[0]?.name,
    founded: company?.foundedYear,
    headquarters,
    country: location?.country,
    employees: company?.employees ? String(company.employees) : undefined,
    socials: pickSocials(data.links),
  };
}

export const brandfetchProvider: BrandEnrichmentProvider = {
  name: "brandfetch",
  enabled: Boolean(CLIENT_ID),
  async enrich(domain) {
    if (!CLIENT_ID) return null;
    try {
      const res = await fetch(`${API_BASE}/${encodeURIComponent(domain)}`, {
        headers: {
          Authorization: `Bearer ${CLIENT_ID}`,
          Accept: "application/json",
        },
        next: { revalidate: 60 * 60 * 24 },
      } as NextFetchInit);
      if (!res.ok) return null;
      return mapBrandfetch((await res.json()) as BfBrand);
    } catch {
      return null;
    }
  },
};
