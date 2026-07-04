"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useOrders } from "@/hooks/useOrders";
import { useProfile } from "@/hooks/useProfile";
import CartSummary from "@/components/cart/CartSummary";

export default function PaymentClient() {
  const router = useRouter();
  const { cartItems, subtotal, shipping, tax, total, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const { profile } = useProfile();

  const [cardName, setCardName] = useState(profile?.name || "John Doe");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add items to checkout.");
      return;
    }
    placeOrder(cartItems, total);
    clearCart();
    router.push("/orders");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Secure Checkout
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Please provide your payment details and billing address.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-12">
        {/* Payment and Billing form */}
        <div className="lg:col-span-7 space-y-8">
          {/* Card Mock Representation */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-violet-600 to-indigo-800 p-6 text-white shadow-xl shadow-indigo-500/10 dark:shadow-none max-w-sm mx-auto w-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-8 -mt-8" />
            <div className="flex justify-between items-center mb-10">
              <span className="text-xs font-bold tracking-widest opacity-80">ELEGANT ESSENCE</span>
              <span className="font-extrabold text-sm italic">VISA</span>
            </div>
            <p className="text-lg tracking-widest font-mono mb-4">
              {cardNumber ? cardNumber.replace(/(.{4})/g, "$1 ").trim() : "•••• •••• •••• 4829"}
            </p>
            <div className="flex justify-between items-center text-xs">
              <div>
                <p className="text-[9px] opacity-60 uppercase">Card Holder</p>
                <p className="font-semibold tracking-wide truncate max-w-[180px]">{cardName}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] opacity-60 uppercase">Expires</p>
                <p className="font-semibold">{cardExpiry || "09 / 29"}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-zinc-200/50 bg-white p-6 dark:border-zinc-800/80 dark:bg-zinc-900">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-800/60 mb-6">
              Payment Details
            </h2>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label
                  htmlFor="card-name"
                  className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
                >
                  Name on Card
                </label>
                <input
                  type="text"
                  id="card-name"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  required
                  className="mt-1.5 block w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-violet-500 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="card-number"
                  className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
                >
                  Card Number
                </label>
                <input
                  type="text"
                  id="card-number"
                  placeholder="4000 1234 5678 9010"
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
                  required
                  className="mt-1.5 block w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-violet-500 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="card-expiry"
                    className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
                  >
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    id="card-expiry"
                    placeholder="MM / YY"
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    required
                    className="mt-1.5 block w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-violet-500 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="card-cvc"
                    className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
                  >
                    CVC / CVV
                  </label>
                  <input
                    type="password"
                    id="card-cvc"
                    placeholder="•••"
                    maxLength={4}
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ""))}
                    required
                    className="mt-1.5 block w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-violet-500 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  />
                </div>
              </div>

              {/* Hidden submit trigger button so standard form submission works */}
              <button type="submit" className="hidden" />
            </form>
          </div>
        </div>

        {/* Order review sidebar */}
        <div className="lg:col-span-5">
          <CartSummary
            isPaymentPage
            items={cartItems}
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            total={total}
            onCompletePayment={() => {
              // Trigger programmatic submit of the form
              const submitBtn = document.querySelector('button[type="submit"]') as HTMLButtonElement;
              if (submitBtn) submitBtn.click();
            }}
          />
        </div>
      </div>
    </div>
  );
}
