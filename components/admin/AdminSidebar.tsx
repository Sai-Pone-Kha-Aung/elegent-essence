"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const sidebarItems = [
    { label: "Overview Dashboard", href: "/admin/dashboard", icon: "📊" },
    { label: "Manage Users", href: "/admin/users", icon: "👥" },
    { label: "Products Inventory", href: "/admin/products", icon: "🧴" },
    { label: "Orders Fulfillment", href: "/admin/orders", icon: "📦" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="rounded-2xl border border-zinc-200/50 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 sticky top-24">
        <div className="mb-6 px-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            Admin Control Panel
          </span>
          <h2 className="mt-1 text-sm font-extrabold text-zinc-900 dark:text-white">
            Management console
          </h2>
        </div>

        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200 ${
                isActive(item.href)
                  ? "bg-violet-50 text-violet-750 dark:bg-violet-950/20 dark:text-violet-400 shadow-sm"
                  : "text-zinc-650 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-white"
              }`}
            >
              <span className="text-sm">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
