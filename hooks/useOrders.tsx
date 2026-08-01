"use client";

import { useEffect } from "react";
import { useOrdersStore } from "@/store/useOrdersStore";

export function useOrders() {
  const store = useOrdersStore();

  useEffect(() => {
    store.initializeOrders();
  }, [store]);

  return store;
}
