import { brandValues } from "@/lib/landing-data";
import SectionHeader from "@/components/ui/SectionHeader";

export default function BrandValues() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
      <SectionHeader
        title="The Elegant Essence Difference"
        subtitle="We obsess over every detail so you can simply enjoy the experience."
      />

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {brandValues.map((value, index) => (
          <div
            key={index}
            className="group relative p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-4 group-hover:scale-110 transition-transform duration-300">
              {value.icon}
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">
              {value.title}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {value.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
