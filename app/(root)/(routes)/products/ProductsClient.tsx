"use client";
import React from "react";
import ProductGrid from "@/components/product/ProductGrid";
import ScentOnboardingCard from "@/components/recommender/ScentOnboardingCard";
import { Product } from "@/types";

interface ProductsClientProps {
  initialProducts?: Product[];
  initialTotal?: number;
  initialBrands?: { name: string; count: number }[];
  initialCategories?: string[];
}

export default function ProductsClient({
  initialProducts = [],
  initialTotal = 0,
  initialBrands = [],
  initialCategories = [],
}: ProductsClientProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/40 border border-violet-200/40 text-violet-700 dark:text-violet-300 text-xs font-semibold mb-3">
          ✨ {initialTotal > 0 ? `${initialTotal} Fragrances Curated` : "Artisanal Collection"}
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          The Curated Collection
        </h1>
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl">
          Explore our complete catalog of authentic Middle Eastern, French, and artisanal perfumes. Filter by brand, olfactory category, or gender profile.
        </p>
      </div>

      {/* Scent Profiler Card */}
      <ScentOnboardingCard />

      <ProductGrid
        initialProducts={initialProducts}
        initialTotal={initialTotal}
        initialBrands={initialBrands}
        initialCategories={initialCategories}
      />
    </div>
  );
}


