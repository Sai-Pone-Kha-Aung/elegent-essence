"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";

export default function EditProfileClient() {
  const router = useRouter();
  const { profile, saveProfile } = useProfile();

  const [name, setName] = useState(profile?.name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [address, setAddress] = useState(profile?.address || "");
  const [preference, setPreference] = useState(profile?.preference || "Woody");

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-zinc-500">Loading profile details...</p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile({
      name,
      phone,
      address,
      preference,
    });
    router.push("/profile");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
            Edit Profile
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Keep your shipping preferences and contact details up-to-date.
          </p>
        </div>
        <Link
          href="/profile"
          className="text-xs font-semibold text-violet-605 hover:text-violet-550 dark:text-violet-400 dark:hover:text-violet-300"
        >
          Cancel & Back
        </Link>
      </div>

      <div className="rounded-2xl border border-zinc-200/50 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
            <div className="sm:col-span-2">
              <label
                htmlFor="name"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
              >
                Full Name
              </label>
              <div className="mt-1.5">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="block w-full rounded-lg border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-violet-500 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
              >
                Email Address
              </label>
              <div className="mt-1.5">
                <input
                  type="email"
                  name="email"
                  id="email"
                  defaultValue={profile.email}
                  required
                  className="block w-full rounded-lg border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white opacity-80 cursor-not-allowed"
                  disabled
                />
              </div>
              <p className="mt-1 text-[10px] text-zinc-400">Email addresses cannot be changed.</p>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
              >
                Phone Number
              </label>
              <div className="mt-1.5">
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full rounded-lg border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-violet-500 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="address"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
              >
                Shipping Address
              </label>
              <div className="mt-1.5">
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="block w-full rounded-lg border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-violet-500 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
              >
                Scent Preference
              </label>
              <div className="mt-1.5">
                <select
                  id="category"
                  name="category"
                  value={preference}
                  onChange={(e) => setPreference(e.target.value)}
                  className="block w-full rounded-lg border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-sm text-zinc-900 focus:border-violet-500 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                >
                  <option value="Woody">Woody & Spicy</option>
                  <option value="Floral">Floral & Fresh</option>
                  <option value="Oriental">Oriental & Rich</option>
                  <option value="Citrus">Citrus & Energizing</option>
                  <option value="Aquatic">Fresh & Aquatic</option>
                </select>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-800/60 pt-6 flex justify-end gap-3">
            <Link
              href="/profile"
              className="rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="rounded-lg bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
