"use client";
import React from "react";
import Link from "next/link";
import { useOrders } from "@/hooks/useOrders";
import { formatCurrency } from "@/lib/format";

export default function OrdersClient() {
  const { orders } = useOrders();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/30";
      case "Shipped":
        return "bg-blue-100 text-blue-850 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/30";
      case "Processing":
      default:
        return "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/30";
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Order History
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Check statuses of your recent purchases and download invoices.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-zinc-200/50 dark:border-zinc-800/80 rounded-3xl bg-white dark:bg-zinc-900/50">
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">No order logs found.</p>
          <Link
            href="/products"
            className="rounded-xl bg-zinc-900 px-6 py-3 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 transition-all shadow-md"
          >
            Shop Catalogue
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order.id}
              className="overflow-hidden rounded-2xl border border-zinc-200/60 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900"
            >
              {/* Order Meta Header */}
              <div className="border-b border-zinc-150 bg-zinc-50/50 px-6 py-4 dark:border-zinc-800/60 dark:bg-zinc-950/20 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="grid grid-cols-2 sm:flex sm:items-center sm:gap-10 gap-y-2 text-xs">
                  <div>
                    <p className="font-semibold uppercase tracking-wider text-zinc-400">Order ID</p>
                    <p className="mt-1 font-bold text-zinc-900 dark:text-white">{order.id}</p>
                  </div>
                  <div>
                    <p className="font-semibold uppercase tracking-wider text-zinc-400">Date Placed</p>
                    <p className="mt-1 font-semibold text-zinc-700 dark:text-zinc-300">{order.date}</p>
                  </div>
                  <div>
                    <p className="font-semibold uppercase tracking-wider text-zinc-400">Total Amount</p>
                    <p className="mt-1 font-bold text-zinc-950 dark:text-white">
                      {formatCurrency(order.total)}
                    </p>
                  </div>
                </div>

                <div>
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Items List */}
              <div className="px-6 py-4 divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-4 first:pt-2 last:pb-2 text-sm"
                  >
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-white">{item.name}</p>
                      <p className="mt-0.5 text-xs text-zinc-400">
                        Volume: {item.volume} &bull; Qty: {item.qty}
                      </p>
                    </div>
                    <p className="font-semibold text-zinc-900 dark:text-white">
                      {formatCurrency(item.price * item.qty)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Actions Footer */}
              <div className="bg-zinc-50/30 px-6 py-3 border-t border-zinc-100 dark:border-zinc-800/60 dark:bg-zinc-950/10 flex justify-end gap-4 text-xs font-semibold">
                <a href="#" className="text-violet-600 hover:text-violet-550 dark:text-violet-400">
                  Track Package
                </a>
                <span className="text-zinc-300 dark:text-zinc-700">|</span>
                <a
                  href="#"
                  className="text-zinc-650 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                >
                  Download Invoice
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
