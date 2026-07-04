"use client";
import React, { useState } from "react";
import { useProfile } from "@/hooks/useProfile";

export default function AdminUsersClient() {
  const { users, toggleSuspendUser, changeUserRole, addUser } = useProfile();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");

  // Add staff modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"Customer" | "Admin">("Admin");

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    addUser({
      name: newName,
      email: newEmail,
      role: newRole,
      status: "Active",
    });

    setNewName("");
    setNewEmail("");
    setNewRole("Admin");
    setIsModalOpen(false);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      selectedRole === "All Roles" ||
      user.role === selectedRole;

    const matchesStatus =
      selectedStatus === "All Statuses" ||
      user.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Manage Users
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Control customer profiles, suspension states, and staff roles.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
        >
          Add New Staff
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pb-4 border-b border-zinc-100 dark:border-zinc-800/60">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search users by name or email..."
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
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
          >
            <option>All Roles</option>
            <option>Customer</option>
            <option>Admin</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
          >
            <option>All Statuses</option>
            <option>Active</option>
            <option>Suspended</option>
          </select>
        </div>
      </div>

      {/* Users table */}
      <div className="rounded-2xl border border-zinc-200/50 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                <th className="pb-3">User Details</th>
                <th className="pb-3">System Role</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Date Joined</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50 text-xs">
              {filteredUsers.map((user) => (
                <tr key={user.email} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20">
                  <td className="py-4">
                    <p className="font-bold text-zinc-900 dark:text-white">{user.name}</p>
                    <p className="text-[10px] text-zinc-400">{user.email}</p>
                  </td>
                  <td className="py-4 text-zinc-700 dark:text-zinc-300 font-medium">
                    <select
                      value={user.role}
                      onChange={(e) => changeUserRole(user.email, e.target.value as "Customer" | "Admin")}
                      className="bg-transparent border-none outline-none font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer"
                    >
                      <option value="Customer">Customer</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                  <td className="py-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold border ${
                        user.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-150 dark:bg-emerald-950/25 dark:text-emerald-400 dark:border-emerald-900/20"
                          : "bg-red-50 text-red-750 border-red-150 dark:bg-red-950/25 dark:text-red-400 dark:border-red-900/20"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 text-zinc-500">{user.joined}</td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => {
                        const newNameInput = prompt(`Edit name for ${user.name}:`, user.name);
                        if (newNameInput !== null && newNameInput.trim() !== "") {
                          // Note: we can add helper to update any user by email if we want, or keep it basic
                          alert("Use Edit Profile for self, or manage directory from backoffice.");
                        }
                      }}
                      className="text-xs font-semibold text-violet-650 hover:text-violet-550 dark:text-violet-400 hover:underline mr-4 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleSuspendUser(user.email)}
                      className={`text-xs font-semibold hover:underline cursor-pointer ${
                        user.status === "Active"
                          ? "text-red-500 hover:text-red-400"
                          : "text-emerald-600 hover:text-emerald-500"
                      }`}
                    >
                      {user.status === "Active" ? "Suspend" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
              Add New Staff Account
            </h2>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-650 dark:text-zinc-400">
                  Staff Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Liam Neeson"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-650 dark:text-zinc-400">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="liam@elegantessence.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-650 dark:text-zinc-400">
                  Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as "Customer" | "Admin")}
                  className="mt-1 block w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                >
                  <option value="Admin">Admin</option>
                  <option value="Customer">Customer</option>
                </select>
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
                  Create Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
