import Link from "next/link";
import { getFeaturedProducts } from "@/lib/db/products";
import ProductCard from "@/components/product/ProductCard";

export default async function FeaturedProducts() {
  const featuredProducts = await getFeaturedProducts(6);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            Featured Essences
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Hand-selected top-rated favorites from our curated 940+ fragrance collection.
          </p>
        </div>
        <Link
          href="/products"
          className="text-xs font-bold text-violet-600 hover:text-violet-500 dark:text-violet-400 flex items-center gap-1 group"
        >
          View All Fragrances
          <svg
            className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} featured />
        ))}
      </div>
    </section>
  );
}

