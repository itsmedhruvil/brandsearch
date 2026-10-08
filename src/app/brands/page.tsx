import type { Metadata } from "next";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { BrandCard } from "@/components/Directory/BrandCard";
import { DirectoryControls } from "@/components/Directory/DirectoryControls";
import { Pagination } from "@/components/Directory/Pagination";
import {
  getCategoryFacets,
  listBrands,
  type BrandSort,
} from "@/lib/brands/repository";

const SORTS = ["name", "founded", "recent"] as const;

export const metadata: Metadata = {
  title: "Brand directory — logos, colours & company facts",
  description:
    "Browse and search a curated directory of brands. Filter by industry and explore logos, brand colours, headquarters and official links.",
  alternates: { canonical: "/brands" },
};

interface BrandsPageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default function BrandsPage({ searchParams = {} }: BrandsPageProps) {
  const q = first(searchParams.q);
  const category = first(searchParams.category);
  const sortParam = first(searchParams.sort);
  const sort: BrandSort = (SORTS as readonly string[]).includes(sortParam ?? "")
    ? (sortParam as BrandSort)
    : "name";
  const page = Number(first(searchParams.page) ?? "1") || 1;

  const result = listBrands({ q, category, sort, page });
  const categories = getCategoryFacets();

  // Preserve the active filters when paging.
  const makeHref = (target: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (sort !== "name") params.set("sort", sort);
    if (target > 1) params.set("page", String(target));
    const qs = params.toString();
    return qs ? `/brands?${qs}` : "/brands";
  };

  return (
    <>
      <Breadcrumb
        pageName="Brand directory"
        description="Explore logos, brand colours, industries and company facts from a curated directory of the world's most recognisable brands."
      />

      <section className="pb-[120px] pt-12 lg:pt-16">
        <div className="container">
          <DirectoryControls categories={categories} total={result.total} />

          {result.items.length === 0 ? (
            <div className="mt-10 rounded-xl border border-stroke bg-white p-10 text-center dark:border-stroke-dark dark:bg-gray-dark">
              <h2 className="text-xl font-semibold text-dark dark:text-white">
                No brands found
              </h2>
              <p className="mt-2 text-body-color dark:text-body-color-dark">
                Try a different search term or clear the category filter.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {result.items.map((brand) => (
                <BrandCard key={brand.id} brand={brand} />
              ))}
            </div>
          )}

          <Pagination
            page={result.page}
            totalPages={result.totalPages}
            makeHref={makeHref}
          />
        </div>
      </section>
    </>
  );
}
