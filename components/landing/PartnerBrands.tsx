import { brands } from "@/lib/landing-data";
import SectionHeader from "@/components/ui/SectionHeader";

export default function PartnerBrands() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
      <SectionHeader
        title="Our Partner Houses"
        subtitle="Exclusive collaborations with the world&apos;s finest fragrance houses."
        className="mb-10"
      />

      <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
        {brands.map((brand, index) => (
          <div
            key={index}
            className="px-6 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300"
          >
            <span className="text-sm font-bold text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
              {brand}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
