export default function Loading() {
  return (
    <section className="pt-32 lg:pt-[170px]">
      <div className="container">
        <div className="h-8 w-56 animate-pulse rounded bg-body-color/10" />
        <div className="mt-4 h-4 w-96 max-w-full animate-pulse rounded bg-body-color/10" />
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-40 animate-pulse rounded-xl border border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
