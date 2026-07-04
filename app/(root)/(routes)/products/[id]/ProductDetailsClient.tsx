"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/format";

interface ProductDetailsClientProps {
  product: Product;
}

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const { addToCart } = useCart();
  const [selectedVolume, setSelectedVolume] = useState("100 ml (Recommended)");

  const handleAddToCart = () => {
    addToCart(product, selectedVolume);
  };

  const handleBuyInstantly = () => {
    addToCart(product, selectedVolume);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          <li>
            <Link href="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              Home
            </Link>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-zinc-300 dark:text-zinc-700">/</span>
            <Link href="/products" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              Products
            </Link>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-zinc-300 dark:text-zinc-700">/</span>
            <span className="text-zinc-900 dark:text-white">{product.name}</span>
          </li>
        </ol>
      </nav>

      {/* Main product presentation grid */}
      <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
        {/* Product Image representation */}
        <div className={`aspect-square w-full rounded-3xl bg-linear-to-br ${product.imageBg} relative overflow-hidden flex items-center justify-center shadow-lg border border-zinc-200/10`}>
          <div className="absolute inset-0 bg-black/5" />
          
          {/* Decorative larger premium bottle layout */}
          <div className="w-32 h-56 border border-white/20 rounded-xl relative flex flex-col items-center justify-between p-4 bg-white/5 backdrop-blur-md shadow-2xl">
            <div className="w-8 h-8 border border-white/30 bg-white/20 rounded-t" />
            <div className="grow w-full border border-white/10 mt-2 rounded bg-white/5 flex flex-col items-center justify-center p-2">
              <span className="text-xs font-bold tracking-widest text-white/50 text-center uppercase">
                ELEGANT
              </span>
              <span className="text-[9px] font-medium tracking-wide text-white/30 text-center uppercase mt-1">
                ESSENCE
              </span>
            </div>
            <div className="w-full h-1 border-t border-white/20 mt-2" />
          </div>
        </div>

        {/* Product Details info column */}
        <div className="flex flex-col justify-between">
          <div>
            <span className="rounded-full bg-violet-100 dark:bg-violet-950/50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-700 dark:text-violet-400">
              {product.category}
            </span>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mt-3 flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? "text-amber-500 fill-amber-500"
                        : "text-zinc-300 dark:text-zinc-700"
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                {product.rating} / 5.0
              </span>
              <span className="text-zinc-300 dark:text-zinc-700">|</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {product.reviews} reviews
              </span>
            </div>

            {/* Price */}
            <p className="mt-5 text-3xl font-extrabold text-zinc-900 dark:text-white">
              {formatCurrency(product.price)}
            </p>

            {/* Description */}
            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <p className="text-sm text-zinc-660 dark:text-zinc-400 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Scent Notes */}
            <div className="mt-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                Scent Profile Notes
              </h3>
              <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {product.notes.map((note) => (
                  <li
                    key={note}
                    className="rounded-lg bg-zinc-50 border border-zinc-200/50 p-2.5 text-xs text-zinc-700 dark:bg-zinc-900 dark:border-zinc-800/80 dark:text-zinc-300"
                  >
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-zinc-200 dark:border-zinc-800/60 pt-6">
            {/* Size Select */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                Select Volume
              </h3>
              <div className="mt-3 flex gap-3">
                {["50 ml", "100 ml (Recommended)"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedVolume(size)}
                    className={`rounded-lg border px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      selectedVolume === size
                        ? "border-violet-600 bg-violet-50 text-violet-700 dark:border-violet-400 dark:bg-violet-950/20 dark:text-violet-400"
                        : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-850 dark:bg-zinc-900 dark:text-zinc-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkout Action buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                className="flex flex-1 items-center justify-center rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-violet-500 hover:shadow-lg dark:bg-violet-500 dark:hover:bg-violet-400 transition-all duration-200 cursor-pointer"
              >
                Add to Cart
              </button>
              <Link
                href="/payment"
                onClick={handleBuyInstantly}
                className="flex flex-1 items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 hover:border-zinc-350 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 transition-all duration-200"
              >
                Buy Instantly
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Accordions/Details Tabs */}
      <div className="mt-16 border-t border-zinc-200 dark:border-zinc-800 pt-10">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">
          Product Details & Ingredients
        </h2>
        <div className="space-y-4 max-w-3xl">
          <details className="group border-b border-zinc-200 dark:border-zinc-800 pb-4" open>
            <summary className="flex cursor-pointer items-center justify-between font-semibold text-zinc-900 dark:text-white text-sm">
              <span>Full Ingredients List</span>
              <span className="transition group-open:-rotate-185">
                <svg
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  className="w-4 h-4 text-zinc-400"
                >
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </span>
            </summary>
            <p className="mt-3 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              {product.ingredients}
            </p>
          </details>

          <details className="group border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <summary className="flex cursor-pointer items-center justify-between font-semibold text-zinc-900 dark:text-white text-sm">
              <span>Usage Instructions</span>
              <span className="transition group-open:-rotate-185">
                <svg
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  className="w-4 h-4 text-zinc-400"
                >
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </span>
            </summary>
            <p className="mt-3 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              Apply spray gently to your pulse points: wrists, inner elbows, and the neck base.
              Avoid rubbing the fragrance into the skin as it may break down notes faster. For
              longevity, mist after applying fragrance-free moisturizer.
            </p>
          </details>

          <details className="group border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <summary className="flex cursor-pointer items-center justify-between font-semibold text-zinc-900 dark:text-white text-sm">
              <span>Shipping & Return Information</span>
              <span className="transition group-open:-rotate-185">
                <svg
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  className="w-4 h-4 text-zinc-400"
                >
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </span>
            </summary>
            <p className="mt-3 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              We offer complimentary standard shipping on all orders over $100. Due to safety
              restrictions regarding perfume transport, returns must be shipped via authorized ground
              transport inside original, unopened shrink wrap boxes within 14 days.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}
