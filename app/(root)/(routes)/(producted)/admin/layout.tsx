"use client";

import React from "react";
import Link from "next/link";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile, isLoggedIn, isAdmin, isInitialized } = useAuth();

  if (!isInitialized) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-violet-600 border-r-transparent"></div>
        <p className="mt-4 text-sm text-zinc-500">Checking permissions...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-3xl dark:bg-violet-950/40">
          🔐
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Admin Sign In Required
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          You must be signed in with an administrator account to view this section.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/sign-in"
            className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors"
          >
            Sign In as Admin
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl dark:bg-red-950/40">
          🚫
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Access Denied
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Your account (<span className="font-semibold">{profile?.email}</span>) does not have administrator privileges.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/"
            className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/sign-in"
            className="rounded-lg border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 transition-colors"
          >
            Switch Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Admin Navigation Sidebar */}
        <AdminSidebar />

        {/* Main Work Content Area */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}

