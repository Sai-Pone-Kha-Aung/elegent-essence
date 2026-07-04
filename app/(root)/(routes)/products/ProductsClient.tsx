"use client";
import React from "react";
import ProductGrid from "@/components/product/ProductGrid";

export default function ProductsClient() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center sm:text-left mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          The Curated Collection
        </h1>
        <p className="mt-4 text-base text-zinc-500 dark:text-zinc-400 max-w-2xl">
          Explore our premium artisanal fragrances. Handcrafted essences designed to evoke deep memories and rich emotions.
        </p>
      </div>

      <ProductGrid />
    </div>
  );
}
