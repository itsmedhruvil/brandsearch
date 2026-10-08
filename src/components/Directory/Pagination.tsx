import Link from "next/link";

interface PaginationProps {
  page: number;
  totalPages: number;
  /** Build the href for a given page, preserving current filters. */
  makeHref: (page: number) => string;
}

const base =
  "flex h-9 min-w-[36px] items-center justify-center rounded-md px-3 text-sm transition";
const idle = `${base} bg-body-color bg-opacity-[15%] text-body-color hover:bg-primary hover:text-white`;
const active = `${base} bg-primary text-white`;

function pageWindow(page: number, totalPages: number): (number | "ellipsis")[] {
  const pages: (number | "ellipsis")[] = [];
  const first = Math.max(1, page - 1);
  const last = Math.min(totalPages, page + 1);

  if (first > 1) {
    pages.push(1);
    if (first > 2) pages.push("ellipsis");
  }
  for (let p = first; p <= last; p += 1) pages.push(p);
  if (last < totalPages) {
    if (last < totalPages - 1) pages.push("ellipsis");
    pages.push(totalPages);
  }
  return pages;
}

export function Pagination({ page, totalPages, makeHref }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-2 pt-10"
      aria-label="Pagination"
    >
      {page > 1 && (
        <Link href={makeHref(page - 1)} className={idle} rel="prev">
          Prev
        </Link>
      )}

      {pageWindow(page, totalPages).map((entry, index) =>
        entry === "ellipsis" ? (
          <span key={`e-${index}`} className="px-2 text-body-color">
            …
          </span>
        ) : (
          <Link
            key={entry}
            href={makeHref(entry)}
            aria-current={entry === page ? "page" : undefined}
            className={entry === page ? active : idle}
          >
            {entry}
          </Link>
        ),
      )}

      {page < totalPages && (
        <Link href={makeHref(page + 1)} className={idle} rel="next">
          Next
        </Link>
      )}
    </nav>
  );
}
