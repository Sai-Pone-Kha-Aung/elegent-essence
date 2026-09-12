"use client";
import React, { useState, useEffect, useTransition } from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/types";

interface BrandCount {
  name: string;
  count: number;
}

interface ProductGridProps {
  initialProducts?: Product[];
  initialTotal?: number;
  initialBrands?: BrandCount[];
  initialCategories?: string[];
}

export default function ProductGrid({
  initialProducts = [],
  initialTotal = 0,
  initialBrands = [],
  initialCategories = [],
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [total, setTotal] = useState(initialTotal);
  const [brands, setBrands] = useState<BrandCount[]>(initialBrands);
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(Math.ceil(initialTotal / 24) || 1);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedGender, setSelectedGender] = useState("All");
  const [selectedSort, setSelectedSort] = useState("rating");

  const [isLoading, setIsLoading] = useState(false);
  const [, startTransition] = useTransition();

  // Categories list
  const categoryList = [
    "All",
    "Fresh & Citrus",
    "Woody",
    "Gourmand",
    "Floral",
    "Oriental & Amber",
    "Oud & Rich Woods",
    "Leather",
    "Aromatic / Fougère",
    "Other",
  ];

  // Fetch filtered products
  const fetchProducts = async (
    targetPage: number = 1,
    query: string = searchQuery,
    cat: string = selectedCategory,
    br: string = selectedBrand,
    gen: string = selectedGender,
    sort: string = selectedSort
  ) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(targetPage),
        limit: "24",
        search: query,
        category: cat,
        brand: br,
        gender: gen,
        sort: sort,
      });

      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();

      setProducts(data.items || []);
      setTotal(data.total || 0);
      setPage(data.page || 1);
      setTotalPages(data.totalPages || 1);
      if (data.brands?.length) setBrands(data.brands);
      if (data.categories?.length) setCategories(data.categories);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search / filter trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(() => {
        fetchProducts(1, searchQuery, selectedCategory, selectedBrand, selectedGender, selectedSort);
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedBrand, selectedGender, selectedSort]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    fetchProducts(newPage, searchQuery, selectedCategory, selectedBrand, selectedGender, selectedSort);
    window.scrollTo({ top: 180, behavior: "smooth" });
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedBrand("All");
    setSelectedGender("All");
    setSelectedSort("rating");
  };

  const isFiltered =
    searchQuery.trim() !== "" ||
    selectedCategory !== "All" ||
    selectedBrand !== "All" ||
    selectedGender !== "All" ||
    selectedSort !== "rating";

  return (
    <div>
      {/* Search and Main Filters Bar */}
      <div className="space-y-4 mb-8 pb-6 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Search Input */}
          <div className="relative flex-1 max-w-lg">
            <input
              type="text"
              placeholder="Search by perfume name, brand, or notes (e.g. Nitro, Dumont, Oud)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/70 px-4 py-3 pl-11 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-violet-400 transition-all shadow-xs"
            />
            <svg
              className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-3.5 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                ✕
              </button>
            )}
          </div>

          {/* Controls: Brand Select, Gender, Sort */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Brand Filter */}
            <div className="relative">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="appearance-none rounded-xl border border-zinc-200 bg-white dark:bg-zinc-900 px-3.5 py-2.5 pr-8 text-xs font-semibold text-zinc-800 dark:text-zinc-200 dark:border-zinc-800 focus:border-violet-500 focus:outline-none cursor-pointer shadow-xs"
              >
                <option value="All">All Brands (51)</option>
                {brands.map((b) => (
                  <option key={b.name} value={b.name}>
                    {b.name} ({b.count})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-2.5 top-3 text-zinc-400">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Gender Filter */}
            <div className="inline-flex rounded-xl border border-zinc-200 dark:border-zinc-800 p-0.5 bg-zinc-50 dark:bg-zinc-900 text-xs font-semibold">
              {["All", "Male", "Female", "Unisex"].map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGender(g)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    selectedGender === g
                      ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-white"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="appearance-none rounded-xl border border-zinc-200 bg-white dark:bg-zinc-900 px-3.5 py-2.5 pr-8 text-xs font-semibold text-zinc-800 dark:text-zinc-200 dark:border-zinc-800 focus:border-violet-500 focus:outline-none cursor-pointer shadow-xs"
              >
                <option value="rating">Top Rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A-Z</option>
                <option value="newest">Newest</option>
              </select>
              <div className="pointer-events-none absolute right-2.5 top-3 text-zinc-400">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Reset Button */}
            {isFiltered && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline px-2 cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2">
          {categoryList.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-zinc-900 text-white shadow-sm dark:bg-white dark:text-zinc-950 scale-105"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header with Counts */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          Showing <span className="font-bold text-zinc-900 dark:text-white">{products.length}</span> of{" "}
          <span className="font-bold text-zinc-900 dark:text-white">{total}</span> fragrances
          {selectedBrand !== "All" && ` • Brand: ${selectedBrand}`}
          {selectedCategory !== "All" && ` • Category: ${selectedCategory}`}
          {selectedGender !== "All" && ` • Gender: ${selectedGender}`}
        </p>

        {isLoading && (
          <div className="flex items-center gap-2 text-xs font-medium text-violet-600 dark:text-violet-400">
            <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Updating catalogue...
          </div>
        )}
      </div>

      {/* Grid of Products */}
      {products.length === 0 ? (
        <div className="text-center py-20 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">No fragrances found</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
            We couldn't find any perfumes matching your current search criteria. Try loosening your filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-violet-500 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-7">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-14 pt-8 border-t border-zinc-200/60 dark:border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Page <span className="font-semibold text-zinc-900 dark:text-white">{page}</span> of{" "}
            <span className="font-semibold text-zinc-900 dark:text-white">{totalPages}</span>
          </p>

          <div className="flex items-center gap-1.5">
            {/* Previous */}
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>

            {/* Page number buttons */}
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pNum = i + 1;
                if (totalPages > 5) {
                  if (page > 3 && page < totalPages - 2) {
                    pNum = page - 2 + i;
                  } else if (page >= totalPages - 2) {
                    pNum = totalPages - 4 + i;
                  }
                }
                return (
                  <button
                    key={pNum}
                    onClick={() => handlePageChange(pNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      page === pNum
                        ? "bg-violet-600 text-white font-bold"
                        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {pNum}
                  </button>
                );
              })}
            </div>

            {/* Next */}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
