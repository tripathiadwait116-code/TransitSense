"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BusCard } from "@/components/BusCard";
import { RouteCard } from "@/components/RouteCard";
import { StopCard } from "@/components/StopCard";
import { Bookmark, Bus, Route, MapPin, Heart, ArrowRight, Lock, Loader2 } from "lucide-react";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const res = await fetch("/api/favorites");
        if (res.status === 401) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        const json = await res.json();
        if (json.success && json.data) {
          setFavorites(json.data);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFavorites();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center text-slate-500 flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
        <span className="text-sm">Loading your saved favorites...</span>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-14 h-14 bg-teal-50 text-teal-800 rounded-2xl flex items-center justify-center mx-auto border border-teal-200">
          <Lock className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">Sign in to Save Favorites</h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          Create an account or log in to bookmark your daily bus commutes, routes, and frequently used stops for instant status checks.
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            href="/login?redirect=/favorites"
            className="px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold border border-slate-200 transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  const busFavs = favorites.filter((f) => f.targetType === "BUS" && f.details);
  const routeFavs = favorites.filter((f) => f.targetType === "ROUTE" && f.details);
  const stopFavs = favorites.filter((f) => f.targetType === "STOP" && f.details);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-teal-800 text-xs font-bold uppercase tracking-wider">
          <Bookmark className="w-4 h-4" />
          <span>My Daily Commute</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Saved Buses & Routes
        </h1>
        <p className="text-sm text-slate-500">
          Quickly monitor your bookmarked services with live telemetry, arrival countdowns, and occupancy estimates.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-3">
          <Heart className="w-10 h-10 text-slate-300 mx-auto" />
          <h2 className="text-base font-bold text-slate-800">No Favorites Saved Yet</h2>
          <p className="text-xs max-w-sm mx-auto">
            Browse through active buses or routes and bookmark them to keep them pinned here for 1-click access.
          </p>
          <div className="pt-2">
            <Link
              href="/track"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-800 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              <span>Explore Buses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Favorite Buses */}
          {busFavs.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Bus className="w-4 h-4 text-teal-700" />
                <span>Saved Buses ({busFavs.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {busFavs.map((fav) => (
                  <BusCard key={fav.id} bus={fav.details} />
                ))}
              </div>
            </div>
          )}

          {/* Favorite Routes */}
          {routeFavs.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Route className="w-4 h-4 text-teal-700" />
                <span>Saved Routes ({routeFavs.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {routeFavs.map((fav) => (
                  <RouteCard key={fav.id} route={fav.details} />
                ))}
              </div>
            </div>
          )}

          {/* Favorite Stops */}
          {stopFavs.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-700" />
                <span>Saved Bus Stops ({stopFavs.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {stopFavs.map((fav) => (
                  <StopCard key={fav.id} stop={fav.details} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
