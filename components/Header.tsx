"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bus,
  MapPin,
  Route as RouteIcon,
  AlertCircle,
  Bookmark,
  ShieldAlert,
  User,
  Menu,
  X,
  LogOut,
  Radio,
} from "lucide-react";
import { UserSession } from "@/types";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const json = await res.json();
        if (json.success && json.data?.user) {
          setUser(json.data.user);
        } else {
          setUser(null);
        }
      } catch (e) {
        setUser(null);
      }
    }
    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      window.location.href = "/";
    } catch (e) {
      console.error(e);
    }
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Track Bus", href: "/track", icon: Radio, highlight: true },
    { label: "Routes", href: "/routes", icon: RouteIcon },
    { label: "Bus Stops", href: "/stops", icon: MapPin },
    { label: "Report Issue", href: "/report", icon: AlertCircle },
    { label: "Favorites", href: "/favorites", icon: Bookmark },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Official Government Prototype Top Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">Transit Sense</span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline text-slate-300">
              RTC Bus Tracker by KLHH Students
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.2 rounded text-[10px] font-semibold uppercase tracking-wider">
              Prototype Mode
            </span>
            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1"
              >
                <ShieldAlert className="w-3 h-3" />
                <span>Admin Console</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-teal-800 text-white flex items-center justify-center shadow-md group-hover:bg-teal-900 transition-colors">
            <Bus className="w-6 h-6 text-teal-200" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold tracking-tight text-slate-900">
                Transit<span className="text-teal-700">Sense</span>
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-medium -mt-0.5 tracking-wide uppercase">
              RTC Bus Tracker · KLHH Students
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-semibold">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? "bg-teal-50 text-teal-900 font-bold border border-teal-200"
                    : link.highlight
                    ? "text-teal-800 hover:bg-teal-50 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {Icon && (
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-teal-700" : link.highlight ? "text-teal-600 animate-pulse" : "text-slate-400"
                    }`}
                  />
                )}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right CTA / Auth Status */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
              <div className="w-7 h-7 rounded-full bg-teal-800 text-white flex items-center justify-center font-bold text-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-left text-xs">
                <div className="font-semibold text-slate-900 leading-none">{user.name}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{user.role}</div>
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 text-slate-400 hover:text-rose-600 p-1 transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-xs font-semibold bg-teal-800 hover:bg-teal-900 text-white px-3.5 py-2 rounded-lg shadow-sm transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/track"
            className="text-xs font-bold bg-teal-800 text-white px-2.5 py-1.5 rounded-lg flex items-center gap-1"
          >
            <Radio className="w-3.5 h-3.5 text-teal-200" />
            <span>Track</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
                    isActive
                      ? "bg-teal-50 border-teal-300 text-teal-900"
                      : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 text-teal-700 shrink-0" />}
                  <span className="truncate">{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2">
            {user ? (
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-teal-800 text-white flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{user.name}</div>
                    <div className="text-[10px] text-slate-500">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-xs font-bold border border-slate-200 rounded-xl text-slate-800 bg-slate-50"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-xs font-bold bg-teal-800 text-white rounded-xl shadow-sm"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
