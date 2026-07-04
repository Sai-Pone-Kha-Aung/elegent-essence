"use client";
import React from "react";
import Link from "next/link";
import { useProfile } from "@/hooks/useProfile";
import { useCart } from "@/hooks/useCart";
import { useOrders } from "@/hooks/useOrders";

export default function ProfileClient() {
  const { profile } = useProfile();
  const { cartCount } = useCart();
  const { orders } = useOrders();

  if (!profile) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <p className="text-zinc-500">Loading profile...</p>
      </div>
    );
  }

  const stats = [
    { label: "Orders Placed", value: orders.length.toString(), href: "/orders" },
    { label: "Items in Cart", value: cartCount.toString(), href: "/cart" },
    { label: "Wishlist Items", value: "8", href: "/products" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Profile Header banner */}
      <div className="relative h-32 rounded-2xl bg-linear-to-r from-violet-600 to-indigo-600 shadow-md">
        <div className="absolute -bottom-10 left-8">
          <div className="h-24 w-24 rounded-full border-4 border-white bg-zinc-200 dark:border-zinc-950 flex items-center justify-center text-4xl shadow-md">
            👤
          </div>
        </div>
      </div>

      <div className="mt-14 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
            {profile.name}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Customer since {profile.joined}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/profile/edit"
            className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-850 dark:bg-zinc-900 dark:text-zinc-300 transition-colors"
          >
            Edit Profile
          </Link>
          <Link
            href="/orders"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors"
          >
            Order History
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-10 grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-xl border border-zinc-200/50 bg-white p-4 text-center hover:border-zinc-300 dark:border-zinc-800/80 dark:bg-zinc-900/50 hover:shadow-sm transition-all"
          >
            <p className="text-2xl font-extrabold text-violet-600 dark:text-violet-400">
              {stat.value}
            </p>
            <p className="mt-1 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
              {stat.label}
            </p>
          </Link>
        ))}
      </div>

      {/* Detailed Info Card */}
      <div className="mt-8 rounded-2xl border border-zinc-200/50 bg-white p-6 dark:border-zinc-800/80 dark:bg-zinc-900">
        <h2 className="text-base font-bold text-zinc-900 dark:text-white pb-4 border-b border-zinc-100 dark:border-zinc-800/60">
          Personal Information
        </h2>
        <dl className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Email Address
            </dt>
            <dd className="mt-1 text-sm font-medium text-zinc-900 dark:text-white">
              {profile.email}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Phone Number
            </dt>
            <dd className="mt-1 text-sm font-medium text-zinc-900 dark:text-white">
              {profile.phone || "Not specified"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Default Shipping Address
            </dt>
            <dd className="mt-1 text-sm font-medium text-zinc-900 dark:text-white leading-relaxed whitespace-pre-line">
              {profile.address || "No address specified"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Preferred Fragrance Category
            </dt>
            <dd className="mt-1 text-sm font-medium text-zinc-900 dark:text-white">
              {profile.preference || "Not specified"}
            </dd>
          </div>
        </dl>
      </div>

      {/* Preferences Section */}
      <div className="mt-8 rounded-2xl border border-zinc-200/50 bg-white p-6 dark:border-zinc-800/80 dark:bg-zinc-900">
        <h2 className="text-base font-bold text-zinc-900 dark:text-white pb-4 border-b border-zinc-100 dark:border-zinc-800/60">
          Account Preferences
        </h2>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                Email Notifications
              </p>
              <p className="text-xs text-zinc-500">
                Receive updates on new collections and members-only pre-orders.
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
            />
          </div>
          <div className="flex items-center justify-between py-2 border-t border-zinc-100 dark:border-zinc-850">
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                Two-Factor Authentication
              </p>
              <p className="text-xs text-zinc-500">
                Secure your account with multi-factor verification codes.
              </p>
            </div>
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
