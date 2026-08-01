import Link from "next/link";
import { INITIAL_PRODUCTS } from "@/lib/data";
import ProductCard from "@/components/product/ProductCard";

export default function FeaturedProducts() {
  const featuredProducts = INITIAL_PRODUCTS.filter((p) => ["1", "3", "6"].includes(p.id));

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            Featured Essences
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Hand-selected favorites from our modern formulation logs.
          </p>
        </div>
        <Link
          href="/products"
          className="text-xs font-bold text-violet-650 hover:text-violet-550 dark:text-violet-450 flex items-center gap-1 group"
        >
          View All Products
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
