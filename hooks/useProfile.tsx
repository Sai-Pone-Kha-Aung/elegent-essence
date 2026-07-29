"use client";

import { useEffect } from "react";
import { useProfileStore } from "@/store/useProfileStore";

export function useProfile() {
  const store = useProfileStore();

  useEffect(() => {
    store.initializeProfile();
  }, [store]);

  return store;
}
