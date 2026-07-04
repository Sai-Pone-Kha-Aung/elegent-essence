"use client";
import React from "react";
import { useCart } from "@/hooks/useCart";
import CartItemCard from "@/components/cart/CartItemCard";
import CartSummary from "@/components/cart/CartSummary";
import Link from "next/link";

export default function CartClient() {
  const { cartItems, updateQuantity, removeFromCart, subtotal, shipping, tax, total } = useCart();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-10">
        Your Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-200/50 dark:border-zinc-800/80 rounded-3xl bg-white dark:bg-zinc-900/50">
          <span className="text-4xl mb-4 block">🧴</span>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">
            Your shopping cart is currently empty.
          </p>
          <Link
            href="/products"
            className="rounded-xl bg-zinc-900 px-6 py-3 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 transition-all shadow-md shadow-black/10 duration-200 inline-block"
          >
            Explore Collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-12">
          {/* Cart items list */}
          <div className="lg:col-span-8 space-y-6">
            {cartItems.map((item) => (
              <CartItemCard
                key={`${item.id}-${item.volume}`}
                item={item}
                onUpdateQuantity={(quantity) => updateQuantity(item.id, item.volume, quantity)}
                onRemove={() => removeFromCart(item.id, item.volume)}
              />
            ))}
          </div>

          {/* Cart Order Summary panel */}
          <div className="lg:col-span-4">
            <CartSummary subtotal={subtotal} shipping={shipping} tax={tax} total={total} />
          </div>
        </div>
      )}
    </div>
  );
}
