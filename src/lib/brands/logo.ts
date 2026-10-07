/**
 * Resolve a logo URL for a domain.
 *
 * Resolution order:
 *   1. Logo.dev  (when NEXT_PUBLIC_LOGO_DEV_TOKEN is configured)
 *   2. Google favicon service (key-free fallback, always available)
 *
 * In production you would rather proxy/cache these through your own CDN so the
 * directory keeps working if a third party changes its terms.
 */
const LOGO_DEV_TOKEN = process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN;

export function logoUrl(domain: string, size = 128): string {
  if (LOGO_DEV_TOKEN) {
    return `https://img.logo.dev/${domain}?token=${LOGO_DEV_TOKEN}&size=${size}&format=png`;
  }
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}

/**
 * Brandfetch logo CDN. Requires a client id; left here as the documented
 * upgrade path (see docs/brand-data-sources.md).
 */
export function brandfetchLogoUrl(domain: string, clientId?: string): string | null {
  const id = clientId ?? process.env.NEXT_PUBLIC_BRANDFETCH_CLIENT_ID;
  if (!id) return null;
  return `https://cdn.brandfetch.io/${domain}/w/512/h/512?c=${id}`;
}
