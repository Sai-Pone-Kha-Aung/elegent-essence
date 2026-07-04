import Link from "next/link";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/format";

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export default function ProductCard({ product, featured = false }: ProductCardProps) {
  if (featured) {
    // Homepage featured card style
    return (
      <Link
        href={`/products/${product.id}`}
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200/50 bg-white p-4 shadow-sm hover:shadow-md transition-all duration-300 dark:border-zinc-800/50 dark:bg-zinc-900"
      >
        {/* Image box representation */}
        <div className={`aspect-square w-full rounded-xl bg-linear-to-br ${product.imageBg} relative overflow-hidden flex items-center justify-center`}>
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
          <div className="w-12 h-20 border border-white/20 rounded-md relative flex flex-col items-center justify-between p-1 bg-white/5 backdrop-blur-sm">
            <span className="text-[7px] font-bold text-white/45">EE</span>
          </div>
        </div>

        {/* Title & Price */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
              {product.name}
            </h3>
            <p className="mt-0.5 text-xs text-zinc-400">{product.category}</p>
          </div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">
            {formatCurrency(product.price)}
          </p>
        </div>
      </Link>
    );
  }

  // Catalogue card style
  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200/50 bg-white p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 dark:border-zinc-800/50 dark:bg-zinc-900"
    >
      {/* Product Image representation using custom styled gradient boxes */}
      <div className={`aspect-square w-full rounded-xl bg-linear-to-br ${product.imageBg} relative overflow-hidden flex items-center justify-center`}>
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
        
        {/* Decorative bottle layout */}
        <div className="w-16 h-28 border border-white/20 rounded-md relative flex flex-col items-center justify-between p-2 bg-white/5 backdrop-blur-sm shadow-2xl">
          <div className="w-4 h-4 border border-white/30 bg-white/20 rounded-t" />
          <div className="grow w-full border border-white/10 mt-1 rounded bg-white/5 flex items-center justify-center">
            <span className="text-[9px] font-bold tracking-widest text-white/50 text-center uppercase">
              EE
            </span>
          </div>
        </div>

        {/* Tag */}
        <span className="absolute top-3 right-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-950 backdrop-blur dark:bg-zinc-900/90 dark:text-white border border-zinc-200/20">
          {product.category}
        </span>
      </div>

      {/* Content info */}
      <div className="mt-4 flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
              {product.name}
            </h3>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">
              {formatCurrency(product.price)}
            </p>
          </div>
          <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Bottom reviews and action */}
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <svg
              className="h-4 w-4 text-amber-500 fill-amber-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              {product.rating}
            </span>
            <span className="text-[10px] text-zinc-400">
              ({product.reviews})
            </span>
          </div>
          <span className="text-[11px] font-semibold text-violet-600 dark:text-violet-400 group-hover:underline flex items-center gap-0.5">
            Details
            <svg
              className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
