"use client";

import { useAuth } from "@/hooks/useAuth";
import ScentOnboardingCard from "@/components/recommender/ScentOnboardingCard";
import PersonalizedShelf from "@/components/recommender/PersonalizedShelf";

export default function PersonalizedSection() {
  const { isLoggedIn, isInitialized } = useAuth();

  if (!isInitialized || !isLoggedIn) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full space-y-16">
      <ScentOnboardingCard />
      <PersonalizedShelf />
    </div>
  );
}
