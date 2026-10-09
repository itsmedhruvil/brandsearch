import Link from "next/link";
import Image from "next/image";
import { BrandLogo } from "@/types/brand";
import brandsData from "./brandsData";

const Brands = () => {
  return (
    <section className="pt-16">
      <div className="container">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-2xl font-bold text-dark dark:text-white sm:text-3xl">
            Explore the brand directory
          </h2>
          <p className="mx-auto mb-6 max-w-[560px] text-body-color dark:text-body-color-dark">
            Logos, brand colours, industries and company facts for the
            world&apos;s most recognisable brands - searchable and filterable.
          </p>
          <Link
            href="/brands"
            className="inline-flex items-center justify-center rounded-sm bg-primary px-8 py-3 text-base font-medium text-white transition hover:bg-opacity-90"
          >
            Browse all brands
          </Link>
        </div>

        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="flex flex-wrap items-center justify-center rounded-sm bg-gray-light px-8 py-8 dark:bg-gray-dark sm:px-10 md:px-[50px] md:py-[40px] xl:p-[50px] 2xl:px-[70px] 2xl:py-[60px]">
              {brandsData.map((brand) => (
                <SingleBrand key={brand.id} brand={brand} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Brands;

const SingleBrand = ({ brand }: { brand: BrandLogo }) => {
  const { href, image, imageLight, name } = brand;

  return (
    <div className="flex w-1/2 items-center justify-center px-3 py-[15px] sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6">
      <a
        href={href}
        target="_blank"
        rel="nofollow noreferrer"
        className="relative h-10 w-full opacity-70 transition hover:opacity-100 dark:opacity-60 dark:hover:opacity-100"
      >
        <Image src={imageLight} alt={name} fill className="hidden dark:block" />
        <Image src={image} alt={name} fill className="block dark:hidden" />
      </a>
    </div>
  );
};
