import React from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  change: string;
  isPositive: boolean;
}

export default function StatCard({ label, value, change, isPositive }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-200/50 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-extrabold text-zinc-900 dark:text-white">
        {value}
      </p>
      <p
        className={`mt-2 text-xs font-medium ${
          isPositive ? "text-emerald-600 dark:text-emerald-450" : "text-amber-600 dark:text-amber-450"
        }`}
      >
        {change}
      </p>
    </div>
  );
}
