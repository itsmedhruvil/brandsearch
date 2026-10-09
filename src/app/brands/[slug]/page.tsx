import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { BrandAvatar } from "@/components/Directory/BrandAvatar";
import { BrandCard } from "@/components/Directory/BrandCard";
import { categoryLabel } from "@/lib/brands/categories";
import {
  getBrandBySlug,
  getBrandSlugs,
  getRelatedBrands,
} from "@/lib/brands/repository";
import { absoluteUrl } from "@/lib/site";

interface BrandPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getBrandSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: BrandPageProps): Metadata {
  const brand = getBrandBySlug(params.slug);
  if (!brand) return { title: "Brand not found" };
  const title = `${brand.name} — brand profile, logo & colours`;
  return {
    title,
    description: brand.description,
    alternates: { canonical: `/brands/${brand.slug}` },
    openGraph: {
      title,
      description: brand.description,
      url: absoluteUrl(`/brands/${brand.slug}`),
      images: brand.logo ? [{ url: brand.logo }] : undefined,
    },
  };
}

const SOCIAL_LABELS: Record<string, string> = {
  twitter: "X / Twitter",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  github: "GitHub",
};

export default function BrandPage({ params }: BrandPageProps) {
  const brand = getBrandBySlug(params.slug);
  if (!brand) notFound();

  const related = getRelatedBrands(brand);

  const facts = [
    brand.founded ? { label: "Founded", value: String(brand.founded) } : null,
    brand.headquarters
      ? { label: "Headquarters", value: brand.headquarters }
      : null,
    brand.country ? { label: "Country", value: brand.country } : null,
    brand.employees ? { label: "Employees", value: brand.employees } : null,
    { label: "Industry", value: brand.industry },
    { label: "Website", value: brand.domain },
  ].filter((f): f is { label: string; value: string } => Boolean(f));

  const socialLinks = Object.entries(brand.socials ?? {}).filter(
    (entry): entry is [string, string] => Boolean(entry[1]),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.name,
    url: brand.website,
    logo: brand.logo,
    description: brand.description,
    foundingDate: brand.founded ? String(brand.founded) : undefined,
    sameAs: socialLinks.map(([, url]) => url),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="pt-32 lg:pt-[170px]">
        <div className="container">
          <nav className="mb-6 text-sm text-body-color" aria-label="Breadcrumb">
            <Link href="/brands" className="hover:text-primary">
              Brand directory
            </Link>
            <span className="px-2">/</span>
            <span className="text-dark dark:text-white">{brand.name}</span>
          </nav>

          <div className="rounded-xl border border-stroke bg-white p-6 dark:border-stroke-dark dark:bg-gray-dark sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <BrandAvatar
                name={brand.name}
                logo={brand.logo}
                color={brand.colors[0]?.hex}
                size={88}
              />
              <div className="min-w-0">
                <h1 className="text-3xl font-bold text-dark dark:text-white">
                  {brand.name}
                </h1>
                <p className="mt-1 text-body-color dark:text-body-color-dark">
                  {brand.tagline}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {categoryLabel(brand.category)}
                  </span>
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full bg-body-color/10 px-3 py-1 text-xs font-medium text-body-color hover:text-primary"
                  >
                    {brand.domain}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            <p className="mt-6 max-w-3xl text-body-color dark:text-body-color-dark">
              {brand.description}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-xl border border-stroke bg-white p-6 dark:border-stroke-dark dark:bg-gray-dark lg:col-span-2">
              <h2 className="text-lg font-semibold text-dark dark:text-white">
                Company facts
              </h2>
              <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="text-xs uppercase tracking-wide text-body-color">
                      {fact.label}
                    </dt>
                    <dd className="mt-0.5 font-medium text-dark dark:text-white">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-xl border border-stroke bg-white p-6 dark:border-stroke-dark dark:bg-gray-dark">
              <h2 className="text-lg font-semibold text-dark dark:text-white">
                Brand colours
              </h2>
              <ul className="mt-4 space-y-2">
                {brand.colors.map((color) => (
                  <li key={color.hex} className="flex items-center gap-3">
                    <span
                      className="h-6 w-6 rounded-md ring-1 ring-black/10 dark:ring-white/20"
                      style={{ backgroundColor: color.hex }}
                    />
                    <code className="text-sm text-dark dark:text-white">
                      {color.hex}
                    </code>
                  </li>
                ))}
              </ul>

              {socialLinks.length > 0 && (
                <>
                  <h2 className="mt-6 text-lg font-semibold text-dark dark:text-white">
                    Links
                  </h2>
                  <ul className="mt-3 space-y-1.5 text-sm">
                    {socialLinks.map(([key, url]) => (
                      <li key={key}>
                        <a
                          href={url}
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                          className="text-body-color hover:text-primary"
                        >
                          {SOCIAL_LABELS[key] ?? key}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          {brand.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {brand.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/brands?q=${encodeURIComponent(tag)}`}
                  className="rounded-full border border-stroke px-3 py-1 text-xs text-body-color transition hover:border-primary hover:text-primary dark:border-stroke-dark"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {related.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-6 text-xl font-bold text-dark dark:text-white">
                More in {categoryLabel(brand.category)}
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <BrandCard key={item.id} brand={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

