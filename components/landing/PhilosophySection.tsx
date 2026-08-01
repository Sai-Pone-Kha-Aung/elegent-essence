import { philosophyStats } from "@/lib/landing-data";

export default function PhilosophySection() {
  return (
    <section className="relative overflow-hidden bg-zinc-50 border border-zinc-150/40 rounded-3xl py-16 px-6 sm:px-12 dark:bg-zinc-900/40 dark:border-zinc-800/80">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-violet-650/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-indigo-650/10 blur-3xl" />

      <div className="mx-auto max-w-3xl text-center relative z-10">
        <span className="text-xs font-bold tracking-widest text-violet-600 dark:text-violet-400 uppercase">
          Our Philosophy
        </span>
        <h2 className="mt-3 text-2xl font-extrabold text-zinc-900 dark:text-white sm:text-3xl">
          The Art of Slow Fragrance
        </h2>
        <p className="mt-5 text-sm sm:text-base text-zinc-650 dark:text-zinc-400 leading-relaxed">
          We believe that a fragrance is more than an accessory; it is a chemical signature that bonds with the wearer. Every bottle is hand-numbered, packed in environment-neutral wood pulp shells, and batch-tested under amber glass lamps in our East Village lab.
        </p>
        <div className="mt-8 grid grid-cols-3 gap-6 max-w-lg mx-auto">
          {philosophyStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-extrabold text-zinc-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-zinc-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
