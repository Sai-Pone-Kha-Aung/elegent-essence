"use client";
import React, { useState, useEffect } from "react";
import { getStoredScentPreference, saveScentPreference } from "@/lib/telemetry";

interface ScentOnboardingCardProps {
  onPreferenceSet?: (preference: string) => void;
}

const SCENT_OPTIONS = [
  { id: "Fresh & Citrus", label: "Fresh & Citrus", emoji: "🍋", desc: "Clean, uplifting, bright" },
  { id: "Woody", label: "Woody & Warm", emoji: "🌲", desc: "Cedar, sandalwood, vetiver" },
  { id: "Gourmand", label: "Gourmand & Vanilla", emoji: "☕", desc: "Sweet, caramel, coffee" },
  { id: "Floral", label: "Floral & Petals", emoji: "🌸", desc: "Jasmine, rose, blossoms" },
  { id: "Oriental & Amber", label: "Oriental & Amber", emoji: "✨", desc: "Spicy, exotic, sensual" },
  { id: "Oud & Rich Woods", label: "Oud & Smokiness", emoji: "🪵", desc: "Bold, opulent, deep" },
];

export default function ScentOnboardingCard({ onPreferenceSet }: ScentOnboardingCardProps) {
  const [selectedFamilies, setSelectedFamilies] = useState<string[]>([]);
  const [hasSaved, setHasSaved] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const saved = getStoredScentPreference();
    if (saved) {
      setHasSaved(true);
      setSelectedFamilies(saved.split(",").map((s) => s.trim()));
    }
  }, []);

  const toggleOption = (id: string) => {
    setSelectedFamilies((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (selectedFamilies.length === 0) return;
    const prefString = selectedFamilies.join(", ");
    saveScentPreference(prefString);
    setHasSaved(true);
    if (onPreferenceSet) onPreferenceSet(prefString);
  };

  const handleReset = () => {
    setHasSaved(false);
    setSelectedFamilies([]);
    saveScentPreference("");
    if (onPreferenceSet) onPreferenceSet("");
  };

  if (isDismissed) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-linear-to-r from-violet-950/40 via-zinc-900 to-black p-6 sm:p-8 text-white shadow-xl">
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-400 mb-2">
            ✨ Cold-Start Fragrance Profiler
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            {hasSaved ? "Your Active Olfactory Signature" : "Discover Your Scent Profile"}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-xl">
            {hasSaved
              ? "We tailor our live recommendations and catalogue order based on your preferences."
              : "Select up to 3 olfactory families you love. Our recommendation engine will instantly calibrate to your taste."}
          </p>
        </div>

        {hasSaved ? (
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors"
            >
              Re-tune Profile
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="text-xs text-zinc-500 hover:text-zinc-400 p-1.5 cursor-pointer"
              title="Dismiss"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={handleSave}
            disabled={selectedFamilies.length === 0}
            className="shrink-0 rounded-xl bg-violet-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all shadow-lg hover:shadow-violet-600/25"
          >
            Apply My Taste ({selectedFamilies.length})
          </button>
        )}
      </div>

      {/* Scent Family Badges */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 relative z-10">
        {SCENT_OPTIONS.map((option) => {
          const isSelected = selectedFamilies.includes(option.id);
          return (
            <button
              key={option.id}
              onClick={() => !hasSaved && toggleOption(option.id)}
              disabled={hasSaved}
              className={`flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? "border-violet-500 bg-violet-950/60 shadow-md ring-1 ring-violet-500/50"
                  : "border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/60 text-zinc-300"
              } ${hasSaved ? "cursor-default opacity-90" : ""}`}
            >
              <span className="text-xl mb-1">{option.emoji}</span>
              <span className="text-xs font-bold text-white">{option.label}</span>
              <span className="text-[10px] text-zinc-400 mt-0.5">{option.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
