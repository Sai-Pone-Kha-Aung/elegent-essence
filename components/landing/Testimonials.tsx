import { testimonials } from "@/lib/landing-data";
import SectionHeader from "@/components/ui/SectionHeader";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 mb-4">
      {Array.from({ length: rating }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-zinc-50 dark:bg-zinc-900/30 rounded-3xl border border-zinc-150/40 dark:border-zinc-800/80 py-16 px-6 sm:px-12">
      <SectionHeader
        title="Loved by Connoisseurs"
        subtitle="What our discerning clientele has to say."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 max-w-6xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="relative p-6 rounded-2xl bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 shadow-sm"
          >
            <StarRating rating={testimonial.rating} />
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-6 italic">
              &ldquo;{testimonial.content}&rdquo;
            </p>
            <div>
              <p className="text-sm font-bold text-zinc-900 dark:text-white">
                {testimonial.name}
              </p>
              <p className="text-xs text-zinc-500">{testimonial.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
