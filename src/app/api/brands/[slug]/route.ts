import { getBrandBySlug } from "@/lib/brands/repository";

/** GET /api/brands/:slug */
export function GET(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  const brand = getBrandBySlug(params.slug);
  if (!brand) {
    return Response.json({ error: "Brand not found" }, { status: 404 });
  }
  return Response.json(brand);
}
