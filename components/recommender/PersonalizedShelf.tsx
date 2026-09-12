"use client";
import React, { useState, useEffect } from "react";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/types";
import { getStoredScentPreference, getOrCreateSessionId } from "@/lib/telemetry";

interface PersonalizedShelfProps {
  initialProducts?: Product[];
  title?: string;
  subtitle?: string;
}

export default function PersonalizedShelf({
  initialProducts = [],
  title = "Curated For You",
  subtitle = "Personalized olfactory matches based on your scent profile and interaction history.",
}: PersonalizedShelfProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [activePreference, setActivePreference] = useState<string | null>(null);

  const loadPersonalizedProducts = async () => {
    setIsLoading(true);
    try {
      const pref = getStoredScentPreference();
      const sessionId = getOrCreateSessionId();
      setActivePreference(pref);

      const params = new URLSearchParams({
        limit: "4",
        ...(pref ? { preference: pref } : {}),
        ...(sessionId ? { sessionId } : {}),
      });

      const res = await fetch(`/api/recommendations?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch recommendations");
      const data = await res.json();
      if (data.items?.length > 0) {
        setProducts(data.items);
      }
    } catch (err) {
      console.warn("Failed to load personalized shelf:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPersonalizedProducts();
  }, []);

  if (products.length === 0 && !isLoading) return null;

  return (
    <section className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
              Personalized Recommendation Engine
            </span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-3xl mt-1">
            {title}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            {activePreference ? (
              <>
                Calibrated to your preference:{" "}
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {activePreference}
                </span>
              </>
            ) : (
              subtitle
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-7">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
