"use client";
import React, { useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import { formatCurrency } from "@/lib/format";

export default function AdminOrdersClient() {
  const { orders, shipOrder, updateOrderStatus } = useOrders();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFulfillment, setSelectedFulfillment] = useState("All Fulfillments");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.buyer && order.buyer.toLowerCase().includes(searchQuery.toLowerCase())) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFulfillment =
      selectedFulfillment === "All Fulfillments" ||
      order.status.toUpperCase() === selectedFulfillment.toUpperCase();

    return matchesSearch && matchesFulfillment;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Orders Fulfillment
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Track customer payments, dispatch pending packages, and log tracking IDs.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pb-4 border-b border-zinc-100 dark:border-zinc-800/60">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search orders by buyer or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50/50 px-3 py-1.5 pl-8 text-xs text-zinc-900 focus:border-violet-500 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
          />
          <svg
            className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={selectedFulfillment}
            onChange={(e) => setSelectedFulfillment(e.target.value)}
            className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
          >
            <option>All Fulfillments</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
          </select>
        </div>
      </div>

      {/* Orders list table */}
      <div className="rounded-2xl border border-zinc-200/50 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
        {filteredOrders.length === 0 ? (
          <p className="text-xs text-zinc-550 dark:text-zinc-400">No orders match the filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  <th className="pb-3">Order Code</th>
                  <th className="pb-3">Customer Name</th>
                  <th className="pb-3">Invoice Sum</th>
                  <th className="pb-3">Date Ordered</th>
                  <th className="pb-3">Delivery State</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50 text-xs">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20">
                    <td className="py-4 font-bold text-zinc-900 dark:text-white">{order.id}</td>
                    <td className="py-4 text-zinc-700 dark:text-zinc-350">
                      {order.buyer || "Guest"}
                    </td>
                    <td className="py-4 font-semibold text-zinc-900 dark:text-white">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="py-4 text-zinc-500">{order.date}</td>
                    <td className="py-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold border ${
                          order.status.toUpperCase() === "DELIVERED"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-150 dark:bg-emerald-950/25 dark:text-emerald-400 dark:border-emerald-900/20"
                            : order.status.toUpperCase() === "SHIPPED"
                            ? "bg-blue-50 text-blue-700 border-blue-150 dark:bg-blue-950/25 dark:text-blue-400 dark:border-blue-900/20"
                            : "bg-amber-50 text-amber-700 border-amber-150 dark:bg-amber-950/25 dark:text-amber-455 dark:border-amber-900/20"
                        }`}
                      >
                        {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      {order.status.toUpperCase() === "PROCESSING" && (
                        <button
                          onClick={() => shipOrder(order.id)}
                          className="text-xs font-semibold text-violet-650 hover:text-violet-550 dark:text-violet-400 hover:underline mr-4 cursor-pointer"
                        >
                          Ship Package
                        </button>
                      )}
                      {order.status.toUpperCase() === "SHIPPED" && (
                        <button
                          onClick={() => updateOrderStatus(order.id, "DELIVERED")}
                          className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 hover:underline mr-4 cursor-pointer"
                        >
                          Mark Delivered
                        </button>
                      )}
                      <button
                        onClick={() => {
                          const itemSummary = order.items
                            .map((i) => `- ${i.name} (${i.volume}) x${i.qty}`)
                            .join("\n");
                          alert(`Order Items for ${order.id}:\n${itemSummary}`);
                        }}
                        className="text-xs font-semibold text-zinc-500 hover:underline cursor-pointer"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
