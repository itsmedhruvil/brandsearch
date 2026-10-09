"use client";

import { useState } from "react";

interface BrandAvatarProps {
  name: string;
  logo?: string;
  /** Fallback colour for the monogram (usually the brand's primary colour). */
  color?: string;
  size?: number;
  className?: string;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Brand logo with a graceful monogram fallback.
 *
 * Uses a plain <img> (not next/image) because logos come from arbitrary,
 * provider-controlled hosts. In production, proxy/cache them through your CDN
 * and switch to next/image for optimisation.
 */
export function BrandAvatar({
  name,
  logo,
  color = "#4A6CF7",
  size = 56,
  className = "",
}: BrandAvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(logo) && !failed;

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-stroke dark:bg-white/5 dark:ring-stroke-dark ${className}`}
      style={{ width: size, height: size }}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo}
          alt={`${name} logo`}
          width={size}
          height={size}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain p-1.5"
          onError={() => setFailed(true)}
        />
      ) : (
        <span
          className="text-base font-bold"
          style={{ color }}
          aria-hidden="true"
        >
          {initials(name)}
        </span>
      )}
    </div>
  );
}
