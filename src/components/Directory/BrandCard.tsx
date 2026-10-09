import Link from "next/link";
import type { Brand } from "@/types/brand";
import { categoryLabel } from "@/lib/brands/categories";
import { BrandAvatar } from "./BrandAvatar";

export function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Link
      href={`/brands/${brand.slug}`}
      className="group flex h-full flex-col rounded-xl border border-stroke bg-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-three dark:border-stroke-dark dark:bg-gray-dark"
    >
      <div className="flex items-center gap-4">
        <BrandAvatar
          name={brand.name}
          logo={brand.logo}
          color={brand.colors[0]?.hex}
        />
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-dark group-hover:text-primary dark:text-white">
            {brand.name}
          </h3>
          <p className="truncate text-sm text-body-color dark:text-body-color-dark">
            {brand.industry}
          </p>
        </div>
      </div>

      <p className="mt-4 line-clamp-3 text-sm text-body-color dark:text-body-color-dark">
        {brand.tagline || brand.description}
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
          {categoryLabel(brand.category)}
        </span>
        {brand.colors.slice(0, 4).map((color) => (
          <span
            key={color.hex}
            title={color.hex}
            className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10 dark:ring-white/20"
            style={{ backgroundColor: color.hex }}
          />
        ))}
      </div>
    </Link>
  );
}
