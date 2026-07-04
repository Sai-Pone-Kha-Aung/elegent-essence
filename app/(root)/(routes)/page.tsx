import Link from "next/link";
import { INITIAL_PRODUCTS } from "@/lib/data";
import ProductCard from "@/components/product/ProductCard";

export const metadata = {
  title: "Elegant Essence - Premium Artisanal Fragrances",
  description: "Discover handcrafted, premium olfactory blends that evoke deep emotion and memory.",
};

export default function Home() {
  const featuredProducts = INITIAL_PRODUCTS.filter((p) => ["1", "3", "6"].includes(p.id));

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-zinc-900 text-white dark:bg-zinc-950/60 border border-zinc-800">
        {/* Soft colored blur lights */}
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-violet-650/25 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-indigo-650/20 blur-3xl" />

        <div className="mx-auto max-w-4xl px-6 py-20 sm:py-24 text-center relative z-10">
          <span className="text-xs font-bold tracking-widest text-violet-400 uppercase">
            Artisanal Fragrance House
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl bg-linear-to-b from-white to-zinc-350 bg-clip-text text-transparent">
            Scents that Define Your Essence
          </h1>
          <p className="mt-6 text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Curated, slow-formulated perfumes using rare organic botanical ingredients. Tailored to react uniquely to your skin chemistry.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="rounded-xl bg-white px-6 py-3 text-xs font-semibold text-zinc-950 hover:bg-zinc-200 transition-all shadow-md shadow-black/10 hover:shadow-lg hover:-translate-y-0.5 duration-200"
            >
              Explore Collection
            </Link>
            <Link
              href="/sign-in"
              className="rounded-xl border border-zinc-750 px-6 py-3 text-xs font-semibold hover:bg-zinc-850 hover:border-zinc-700 transition-all duration-200"
            >
              Join Members Club
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
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

      {/* Philosophy Banner */}
      <section className="bg-zinc-50 border border-zinc-150/40 rounded-3xl py-12 px-6 sm:px-12 dark:bg-zinc-900/40 dark:border-zinc-800/80">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white sm:text-2xl">
            Our Olfactory Philosophy
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-zinc-650 dark:text-zinc-400 leading-relaxed">
            We believe that a fragrance is more than an accessory; it is a chemical signature that bonds with the wearer. Every bottle is hand-numbered, packed in environment-neutral wood pulp shells, and batch-tested under amber glass lamps in our East Village lab.
          </p>
        </div>
      </section>
    </div>
  );
}
