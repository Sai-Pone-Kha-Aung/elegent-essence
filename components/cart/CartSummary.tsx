"use client";
import React from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import { CartItem } from "@/types";

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  isPaymentPage?: boolean;
  items?: CartItem[];
  onCompletePayment?: () => void;
}

export default function CartSummary({
  subtotal,
  shipping,
  tax,
  total,
  isPaymentPage = false,
  items = [],
  onCompletePayment,
}: CartSummaryProps) {
  if (isPaymentPage) {
    return (
      <div className="rounded-2xl border border-zinc-200/50 bg-white p-6 dark:border-zinc-800/80 dark:bg-zinc-900">
        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-800/60 mb-6">
          Review Your Order
        </h2>

        {/* Order review list */}
        {items.length > 0 && (
          <ul className="space-y-4 mb-6">
            {items.map((item) => (
              <li key={`${item.id}-${item.volume}`} className="flex justify-between text-xs">
                <span className="text-zinc-500">
                  {item.name} ({item.volume})
                  {item.quantity > 1 && ` x ${item.quantity}`}
                </span>
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        )}

        <dl className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800/60 mb-8">
          <div className="flex justify-between text-xs">
            <dt className="text-zinc-500">Subtotal</dt>
            <dd className="font-semibold text-zinc-900 dark:text-white">
              {formatCurrency(subtotal)}
            </dd>
          </div>
          <div className="flex justify-between text-xs">
            <dt className="text-zinc-500">Shipping</dt>
            <dd className={`font-semibold ${shipping === 0 ? "text-emerald-600 dark:text-emerald-450" : "text-zinc-900 dark:text-white"}`}>
              {shipping === 0 ? "Free" : formatCurrency(shipping)}
            </dd>
          </div>
          <div className="flex justify-between text-xs">
            <dt className="text-zinc-500">Estimated Tax (8%)</dt>
            <dd className="font-semibold text-zinc-900 dark:text-white">
              {formatCurrency(tax)}
            </dd>
          </div>
          <div className="flex justify-between text-sm pt-3 border-t border-zinc-100 dark:border-zinc-850 font-extrabold text-zinc-900 dark:text-white">
            <dt>Total</dt>
            <dd>{formatCurrency(total)}</dd>
          </div>
        </dl>

        <div className="space-y-3">
          <button
            onClick={onCompletePayment}
            className="flex w-full items-center justify-center rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-violet-500 hover:shadow-lg dark:bg-violet-500 dark:hover:bg-violet-400 transition-all cursor-pointer"
          >
            Complete Payment & Place Order
          </button>
          <Link
            href="/cart"
            className="flex w-full items-center justify-center rounded-xl border border-zinc-200 bg-white py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-850 transition-all"
          >
            Return to Cart
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200/50 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
      <h2 className="text-base font-bold text-zinc-900 dark:text-white pb-4 border-b border-zinc-100 dark:border-zinc-800/60">
        Order Summary
      </h2>

      <dl className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <dt className="text-xs text-zinc-500 dark:text-zinc-400">Subtotal</dt>
          <dd className="text-xs font-semibold text-zinc-900 dark:text-white">
            {formatCurrency(subtotal)}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-xs text-zinc-500 dark:text-zinc-400">Shipping Estimate</dt>
          <dd className="text-xs font-semibold text-zinc-900 dark:text-white">
            {shipping === 0 ? "Free" : formatCurrency(shipping)}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-xs text-zinc-500 dark:text-zinc-400">Tax Estimate (8%)</dt>
          <dd className="text-xs font-semibold text-zinc-900 dark:text-white">
            {formatCurrency(tax)}
          </dd>
        </div>
        <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/60 pt-4">
          <dt className="text-sm font-bold text-zinc-900 dark:text-white">Total</dt>
          <dd className="text-sm font-bold text-zinc-900 dark:text-white">
            {formatCurrency(total)}
          </dd>
        </div>
      </dl>

      {/* Promo Code Input Mockup */}
      <div className="mt-6">
        <label htmlFor="promo" className="sr-only">
          Promo Code
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            id="promo"
            placeholder="Promo Code"
            className="block w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-violet-500 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
          />
          <button className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-850 cursor-pointer">
            Apply
          </button>
        </div>
      </div>

      <div className="mt-8">
        {subtotal === 0 ? (
          <button
            disabled
            className="flex w-full items-center justify-center rounded-xl bg-zinc-300 py-3 text-sm font-semibold text-zinc-500 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600"
          >
            Cart is Empty
          </button>
        ) : (
          <Link
            href="/payment"
            className="flex w-full items-center justify-center rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors"
          >
            Proceed to Checkout
          </Link>
        )}
      </div>
      <div className="mt-4 text-center">
        <Link
          href="/products"
          className="text-xs text-violet-650 hover:text-violet-550 dark:text-violet-400 font-semibold"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
