"use client";

import { useEffect } from "react";
import { useProductsStore } from "@/store/useProductsStore";

export function useProducts() {
  const store = useProductsStore();

  useEffect(() => {
    store.initializeProducts();
  }, [store]);

  return store;
}
