"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Role } from "@/types";

export default function SignInPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);

    const result = login(email, password);

    if (!result.success) {
      setError(result.error || "Sign in failed. Please check your credentials.");
      setIsLoading(false);
      return;
    }

    if (result.user?.role === Role.ADMIN) {
      router.push("/admin/dashboard");
    } else {
      router.push("/");
    }
  };

  const fillDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError("");
  };

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center text-center">
          <span className="bg-linear-to-br from-violet-600 to-indigo-600 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent dark:from-violet-400 dark:to-indigo-400">
            ELEGANT ESSENCE
          </span>
        </Link>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Or{" "}
          <Link
            href="/sign-up"
            className="font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300 transition-colors"
          >
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow-xl shadow-zinc-200/55 dark:shadow-none sm:rounded-2xl sm:px-10 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80">
          
          {/* Quick Demo Logins Helper */}
          <div className="mb-6 rounded-xl border border-violet-100 bg-violet-50/60 p-3.5 dark:border-violet-900/30 dark:bg-violet-950/20">
            <p className="text-xs font-semibold text-violet-900 dark:text-violet-300 mb-2">
              ⚡ Quick Demo Credentials:
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount("john.doe@example.com", "password123")}
                className="cursor-pointer rounded-md bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 shadow-xs border border-zinc-200 hover:border-violet-300 hover:text-violet-700 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:text-violet-300 transition-all"
              >
                Customer (John)
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount("admin@elegantessence.com", "adminpassword")}
                className="cursor-pointer rounded-md bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 shadow-xs border border-zinc-200 hover:border-violet-300 hover:text-violet-700 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:text-violet-300 transition-all"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount("mercer@gentek.org", "password123")}
                className="cursor-pointer rounded-md bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 shadow-xs border border-zinc-200 hover:border-violet-300 hover:text-violet-700 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:text-violet-300 transition-all"
              >
                Suspended User
              </button>
            </div>
          </div>

          {/* Error Message Box */}
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-400 border border-red-200 dark:border-red-900/40 flex items-start gap-2 animate-in fade-in duration-150">
              <span className="text-red-500 font-bold shrink-0">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  placeholder="name@example.com"
                  className="block w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder-zinc-600 dark:focus:bg-zinc-950 sm:text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="block w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-3 pr-16 py-2 text-zinc-900 placeholder-zinc-400 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder-zinc-600 dark:focus:bg-zinc-950 sm:text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs font-semibold text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer focus:outline-none select-none"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:ring-offset-zinc-900"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-zinc-900 dark:text-zinc-300"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setError("Password reset is currently disabled. Please use demo credentials.");
                  }}
                  className="font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center items-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin text-current" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
