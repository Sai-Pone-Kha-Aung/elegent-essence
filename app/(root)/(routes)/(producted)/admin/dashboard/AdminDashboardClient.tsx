"use client";
import StatCard from "@/components/admin/StatCard";
import { useOrders } from "@/hooks/useOrders";
import { useProducts } from "@/hooks/useProducts";
import { useProfile } from "@/hooks/useProfile";
import { formatCurrency, formatStock } from "@/lib/format";

export default function AdminDashboardClient() {
  const { orders } = useOrders();
  const { products } = useProducts();
  const { users } = useProfile();

  // Dynamic calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const activeCustomers = users.filter((u) => u.role === "CUSTOMER" && u.status === "ACTIVE").length;
  const totalInventory = products.reduce((sum, p) => sum + p.stock, 0);
  const pendingShipments = orders.filter((o) => o.status === "PROCESSING").length;

  const stats = [
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      change: "+12.4% MoM",
      isPositive: true,
    },
    {
      label: "Active Customers",
      value: activeCustomers.toString(),
      change: "+4.8% MoM",
      isPositive: true,
    },
    {
      label: "Items in Inventory",
      value: formatStock(totalInventory),
      change: "98% in stock",
      isPositive: true,
    },
    {
      label: "Pending Shipments",
      value: `${pendingShipments} order${pendingShipments === 1 ? "" : "s"}`,
      change: pendingShipments > 0 ? "Needs attention" : "All clear",
      isPositive: pendingShipments === 0,
    },
  ];

  const recentTransactions = orders.slice(0, 4).map((o) => ({
    id: o.id.replace("EE-", "TXN-"),
    customer: o.buyer || "John Doe",
    date: o.date,
    status: "Paid",
    amount: formatCurrency(o.total),
  }));

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Overview Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Real-time metrics, inventory counts, and pending order statistics.
        </p>
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            isPositive={stat.isPositive}
          />
        ))}
      </div>

      {/* Graphical Chart Mockup */}
      <div className="rounded-2xl border border-zinc-200/50 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
            Sales Performance Chart
          </h2>
          <span className="text-xs text-zinc-400 font-semibold bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 px-3 py-1 rounded-full">
            Last 30 Days
          </span>
        </div>

        {/* Simple CSS-drawn bar chart */}
        <div className="h-48 flex items-end gap-3 sm:gap-6 pt-4 border-b border-l border-zinc-150 dark:border-zinc-800 px-4">
          {[40, 65, 45, 80, 55, 90, 75, 95, 60, 85, 70, 100].map((height, i) => (
            <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
              {/* Tooltip */}
              <span className="absolute -top-6 text-[10px] font-bold bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                ${height * 20}
              </span>
              <div
                style={{ height: `${height}%` }}
                className="w-full bg-linear-to-t from-violet-600 to-indigo-500 dark:from-violet-500 dark:to-indigo-400 rounded-t group-hover:from-violet-500 transition-all duration-300 shadow-lg shadow-violet-500/10"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-3 text-[10px] font-bold text-zinc-400 px-4">
          <span>Week 1</span>
          <span>Week 2</span>
          <span>Week 3</span>
          <span>Week 4</span>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="rounded-2xl border border-zinc-200/50 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-6">
          Recent Transactions
        </h2>
        {recentTransactions.length === 0 ? (
          <p className="text-xs text-zinc-550 dark:text-zinc-400">No transaction logs recorded.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  <th className="pb-3">Transaction ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50 text-xs">
                {recentTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20">
                    <td className="py-3 font-semibold text-zinc-900 dark:text-white">{txn.id}</td>
                    <td className="py-3 text-zinc-750 dark:text-zinc-300">{txn.customer}</td>
                    <td className="py-3 text-zinc-500">{txn.date}</td>
                    <td className="py-3">
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                        {txn.status}
                      </span>
                    </td>
                    <td className="py-3 text-right font-bold text-zinc-900 dark:text-white">
                      {txn.amount}
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
