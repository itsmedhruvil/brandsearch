import type { NextRequest } from "next/server";
import {
  getCategoryFacets,
  listBrands,
  type BrandSort,
} from "@/lib/brands/repository";

const SORTS: BrandSort[] = ["name", "founded", "recent"];

function parseSort(value: string | null): BrandSort | undefined {
  return value && (SORTS as string[]).includes(value) ? (value as BrandSort) : undefined;
}

function parseNumber(value: string | null): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * GET /api/brands?q=&category=&tag=&featured=&sort=&page=&pageSize=
 * Returns a paginated list plus category facets for building filter UIs.
 */
export function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const featured = sp.get("featured");

  const result = listBrands({
    q: sp.get("q") ?? undefined,
    category: sp.get("category") ?? undefined,
    tag: sp.get("tag") ?? undefined,
    featured: featured === null ? undefined : featured !== "false",
    sort: parseSort(sp.get("sort")),
    page: parseNumber(sp.get("page")),
    pageSize: parseNumber(sp.get("pageSize")),
  });

  return Response.json({
    ...result,
    facets: { categories: getCategoryFacets() },
  });
}
