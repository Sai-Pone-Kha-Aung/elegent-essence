"use client";
import { useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";

export function useCart() {
  const store = useCartStore();

  useEffect(() => {
    store.initializeCart();
  }, [store]);

  return store;
}
