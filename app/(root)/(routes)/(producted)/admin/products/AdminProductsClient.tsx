"use client";
import React, { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { formatCurrency, formatStock } from "@/lib/format";
import { Product } from "@/types";

export default function AdminProductsClient() {
  const { products, addProduct, deleteProduct, updateStock } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Inventory Statuses");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Woody & Warm");
  const [newPrice, setNewPrice] = useState("150");
  const [newStock, setNewStock] = useState("20");
  const [newDescription, setNewDescription] = useState("");

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    // Pick a random product gradient image background
    const backgrounds = [
      "from-zinc-900 to-amber-950",
      "from-emerald-900 to-teal-950",
      "from-rose-950 to-orange-950",
      "from-yellow-900 to-lime-950",
      "from-blue-950 to-indigo-950",
      "from-purple-950 to-zinc-950",
    ];
    const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];

    addProduct({
      name: newName,
      category: newCategory,
      price: parseFloat(newPrice) || 100,
      rating: 4.8,
      reviews: 1,
      imageBg: randomBg,
      description: newDescription || `${newName} is a premium curated fragrance custom-designed for this catalogue.`,
      notes: ["Top: Bergamot", "Heart: White Petals", "Base: Clean Amber"],
      ingredients: "Alcohol Denat., Fragrance (Parfum), Water\\Aqua\\Eau.",
      stock: parseInt(newStock) || 0,
    });

    // Reset Form
    setNewName("");
    setNewPrice("150");
    setNewStock("20");
    setNewDescription("");
    setIsModalOpen(false);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (selectedStatus === "In Stock") {
      matchesStatus = product.status === "In Stock";
    } else if (selectedStatus === "Low Stock") {
      matchesStatus = product.status === "Low Stock";
    } else if (selectedStatus === "Out of Stock") {
      matchesStatus = product.status === "Out of Stock";
    }

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Products Inventory
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Control items pricing, update stock numbers, and manage catalog publications.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
        >
          Create Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pb-4 border-b border-zinc-100 dark:border-zinc-800/60">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search items by name..."
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
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
          >
            <option>All Inventory Statuses</option>
            <option>In Stock</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products list table */}
      <div className="rounded-2xl border border-zinc-200/50 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                <th className="pb-3">Product Name</th>
                <th className="pb-3">Stock Count</th>
                <th className="pb-3">Price Status</th>
                <th className="pb-3">Stock State</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50 text-xs">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20">
                  <td className="py-4 font-bold text-zinc-900 dark:text-white">{product.name}</td>
                  <td className="py-4 text-zinc-700 dark:text-zinc-350">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateStock(product.id, Math.max(0, product.stock - 1))}
                        className="h-5 w-5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded flex items-center justify-center font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="min-w-[45px] text-center">{formatStock(product.stock)}</span>
                      <button
                        onClick={() => updateStock(product.id, product.stock + 1)}
                        className="h-5 w-5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded flex items-center justify-center font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="py-4 font-semibold text-zinc-900 dark:text-white">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="py-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold border ${
                        product.status === "In Stock"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-150 dark:bg-emerald-950/25 dark:text-emerald-400 dark:border-emerald-900/20"
                          : product.status === "Low Stock"
                          ? "bg-amber-50 text-amber-700 border-amber-150 dark:bg-amber-950/25 dark:text-amber-455 dark:border-amber-900/20"
                          : "bg-red-50 text-red-750 border-red-150 dark:bg-red-950/25 dark:text-red-400 dark:border-red-900/20"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => {
                        const newStockInput = prompt(`Update stock count for ${product.name}:`, product.stock.toString());
                        if (newStockInput !== null) {
                          const amt = parseInt(newStockInput);
                          if (!isNaN(amt) && amt >= 0) {
                            updateStock(product.id, amt);
                          }
                        }
                      }}
                      className="text-xs font-semibold text-violet-650 hover:text-violet-550 dark:text-violet-400 hover:underline mr-4 cursor-pointer"
                    >
                      Quick Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${product.name}?`)) {
                          deleteProduct(product.id);
                        }
                      }}
                      className="text-xs font-semibold text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Product Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl relative">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
              Create New Fragrance Product
            </h2>
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-650 dark:text-zinc-400">
                  Fragrance Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amber Moss"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-650 dark:text-zinc-400">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  >
                    <option>Woody & Warm</option>
                    <option>Floral & Fresh</option>
                    <option>Oriental & Rich</option>
                    <option>Fresh & Citrus</option>
                    <option>Fresh & Aquatic</option>
                    <option>Sensual Floral</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-650 dark:text-zinc-400">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="150"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-650 dark:text-zinc-400">
                  Initial Stock
                </label>
                <input
                  type="number"
                  required
                  placeholder="20"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-650 dark:text-zinc-400">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief story of the olfactory blend..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-150 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-650 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-zinc-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 cursor-pointer"
                >
                  Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
