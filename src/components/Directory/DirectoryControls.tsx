"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { Search } from "lucide-react";
import type { CategoryFacet } from "@/lib/brands/repository";

interface DirectoryControlsProps {
  categories: CategoryFacet[];
  total: number;
}

const fieldClass =
  "rounded-lg border border-stroke bg-transparent px-3 py-2.5 text-sm text-dark outline-none transition focus:border-primary dark:border-stroke-dark dark:text-white";

/**
 * Search / category / sort controls. State lives in the URL so results are
 * shareable, bookmarkable and server-rendered (no client-side data fetching).
 */
export function DirectoryControls({ categories, total }: DirectoryControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const category = searchParams.get("category") ?? "";
  const sort = searchParams.get("sort") ?? "name";

  const searchParamsRef = useRef(searchParams);
  searchParamsRef.current = searchParams;

  const navigate = (patch: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParamsRef.current.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page");
    const qs = params.toString();
    startTransition(() =>
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }),
    );
  };

  useEffect(() => {
    const current = searchParamsRef.current.get("q") ?? "";
    if (query === current) return;
    const timer = setTimeout(() => navigate({ q: query || undefined }), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-stroke bg-white p-4 dark:border-stroke-dark dark:bg-gray-dark md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-body-color" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search brands, industries or tags..."
          aria-label="Search brands"
          className={`w-full pl-9 ${fieldClass}`}
        />
      </div>

      <select
        value={category}
        onChange={(event) => navigate({ category: event.target.value || undefined })}
        aria-label="Filter by category"
        className={fieldClass}
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.label} ({c.count})
          </option>
        ))}
      </select>

      <select
        value={sort}
        onChange={(event) =>
          navigate({ sort: event.target.value === "name" ? undefined : event.target.value })
        }
        aria-label="Sort brands"
        className={fieldClass}
      >
        <option value="name">A–Z</option>
        <option value="founded">Oldest first</option>
        <option value="recent">Recently updated</option>
      </select>

      <span
        className="text-sm text-body-color dark:text-body-color-dark md:pl-2"
        aria-live="polite"
      >
        {isPending ? "Searching…" : `${total} brand${total === 1 ? "" : "s"}`}
      </span>
    </div>
  );
}
