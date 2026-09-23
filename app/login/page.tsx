"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Bus, Lock, Mail, ArrowRight, Loader2, ShieldCheck, User } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        if (json.data.user.role === "ADMIN" && redirect === "/") {
          router.push("/admin");
        } else {
          router.push(redirect);
        }
      } else {
        setError(json.error?.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = (role: "ADMIN" | "PASSENGER") => {
    if (role === "ADMIN") {
      setEmail("admin@smartrtc.in");
      setPassword("Admin@RTC2026!");
    } else {
      setEmail("passenger@smartrtc.in");
      setPassword("Passenger@2026!");
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Banner */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-800 text-white flex items-center justify-center mx-auto shadow-md">
            <Bus className="w-7 h-7 text-teal-200" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Sign in to Telangana Smart RTC
          </h1>
          <p className="text-xs text-slate-500">
            Access passenger favorites, submit grievance reports, or manage fleet operations.
          </p>
        </div>

        {/* Demo Credentials Quick-Fill Buttons */}
        <div className="bg-slate-100/80 border border-slate-200 rounded-2xl p-3.5 space-y-2 text-xs">
          <div className="font-bold text-slate-600 uppercase tracking-wider text-[10px]">
            ⚡ Quick-fill Demo Credentials
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo("ADMIN")}
              className="p-2 rounded-xl bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-left transition-all group"
            >
              <div className="font-bold text-slate-800 group-hover:text-amber-900 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Admin Role</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">admin@smartrtc.in</div>
            </button>

            <button
              type="button"
              onClick={() => handleFillDemo("PASSENGER")}
              className="p-2 rounded-xl bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-left transition-all group"
            >
              <div className="font-bold text-slate-800 group-hover:text-teal-900 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-teal-600" />
                <span>Passenger Role</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">passenger@smartrtc.in</div>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4"
        >
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@smartrtc.in"
                className="w-full h-11 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors mt-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span>Sign In</span>
            )}
          </button>

          <div className="pt-2 text-center text-xs text-slate-500">
            Don&apos;t have an account yet?{" "}
            <Link href="/register" className="text-teal-800 font-bold hover:underline">
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-950"><div className="text-white">Loading…</div></div>}>
      <LoginForm />
    </Suspense>
  );
}
