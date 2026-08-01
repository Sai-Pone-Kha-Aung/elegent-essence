import Link from "next/link";
import { heroBadges } from "@/lib/landing-data";

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-zinc-900 text-white dark:bg-zinc-950/60 border border-zinc-800">
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-violet-650/25 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-indigo-650/20 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-rose-650/15 blur-3xl" />

      <div className="mx-auto max-w-4xl px-6 py-20 sm:py-28 text-center relative z-10">
        <span className="text-xs font-bold tracking-widest text-violet-400 uppercase">
          Artisanal Fragrance House
        </span>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl bg-linear-to-b from-white to-zinc-350 bg-clip-text text-transparent leading-tight">
          Scents that Define Your Essence
        </h1>
        <p className="mt-6 text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Curated, slow-formulated perfumes using rare organic botanical ingredients. Tailored to react uniquely to your skin chemistry.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/products"
            className="rounded-xl bg-white px-8 py-3.5 text-xs font-semibold text-zinc-950 hover:bg-zinc-200 transition-all shadow-md shadow-black/10 hover:shadow-lg hover:-translate-y-0.5 duration-200"
          >
            Explore Collection
          </Link>
          <Link
            href="/sign-in"
            className="rounded-xl border border-zinc-750 px-8 py-3.5 text-xs font-semibold hover:bg-zinc-850 hover:border-zinc-700 transition-all duration-200"
          >
            Join Members Club
          </Link>
        </div>
        <div className="mt-12 flex items-center justify-center gap-8 text-xs text-zinc-500">
          {heroBadges.map((badge) => (
            <div key={badge} className="flex items-center gap-2">
              <CheckIcon />
              <span>{badge}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
