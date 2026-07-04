"use client";
import React from "react";
import { CartItem } from "@/types";
import { formatCurrency } from "@/lib/format";

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export default function CartItemCard({ item, onUpdateQuantity, onRemove }: CartItemCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-zinc-200/50 bg-white p-4 dark:border-zinc-800/80 dark:bg-zinc-900/50">
      <div className={`h-20 w-20 rounded-xl bg-linear-to-br ${item.imageBg} flex items-center justify-center relative overflow-hidden shrink-0 border border-zinc-200/10`}>
        <div className="w-8 h-12 border border-white/20 rounded-sm relative flex flex-col items-center justify-between p-1 bg-white/5 backdrop-blur-sm">
          <span className="text-[6px] font-bold text-white/50">EE</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
            {item.name}
          </h3>
          <p className="mt-0.5 text-xs text-zinc-400">
            {item.category} &bull; {item.volume}
          </p>
          <p className="mt-1 text-xs font-semibold text-zinc-900 dark:text-white">
            {formatCurrency(item.price)}
          </p>
        </div>

        {/* Quantity selection & Remove actions */}
        <div className="flex items-center justify-between sm:justify-end gap-6">
          <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-1">
            <button
              onClick={() => onUpdateQuantity(item.quantity - 1)}
              className="h-6 w-6 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white text-xs font-bold cursor-pointer"
            >
              &minus;
            </button>
            <span className="px-3 text-xs font-semibold text-zinc-900 dark:text-white select-none">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.quantity + 1)}
              className="h-6 w-6 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white text-xs font-bold cursor-pointer"
            >
              +
            </button>
          </div>
          <button
            onClick={onRemove}
            className="text-xs font-medium text-red-500 hover:underline cursor-pointer"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
