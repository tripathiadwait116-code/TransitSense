"use client";

import React, { useState, useEffect } from "react";
import { BusStopDTO } from "@/types";
import { StopCard } from "@/components/StopCard";
import { MapPin, Navigation, Search, Locate, Loader2 } from "lucide-react";

export default function StopsPage() {
  const [stops, setStops] = useState<BusStopDTO[]>([]);
  const [search, setSearch] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStops = async (lat?: number, lng?: number) => {
    setIsLoading(true);
    try {
      let url = `/api/stops?search=${encodeURIComponent(search)}`;
      if (lat !== undefined && lng !== undefined) {
        url += `&lat=${lat}&lng=${lng}`;
      }
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && json.data) {
        setStops(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStops(userLocation?.lat, userLocation?.lng);
  }, [search, userLocation]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLocating(false);
      },
      (err) => {
        console.warn("Location permission denied:", err);
        setIsLocating(false);
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header & Geolocation Finder */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-teal-800 text-xs font-bold uppercase tracking-wider">
          <MapPin className="w-4 h-4" />
          <span>RTC Stop Points</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Find Bus Stops in Telangana
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              Search any bus stop or enable GPS to instantly identify the closest boarding points with walking distance and upcoming arrivals.
            </p>
          </div>

          <button
            onClick={handleGetLocation}
            disabled={isLocating}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all shadow-sm ${
              userLocation
                ? "bg-teal-50 border-teal-300 text-teal-900"
                : "bg-teal-800 hover:bg-teal-900 border-teal-900 text-white"
            }`}
          >
            {isLocating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Locate className="w-4 h-4 text-teal-200" />
            )}
            <span>
              {userLocation ? "Location Synced (Nearest First)" : "Find Stops Near Me"}
            </span>
          </button>
        </div>

        {/* Search input */}
        <div className="pt-2">
          <div className="relative flex items-center bg-slate-50 rounded-xl border border-slate-200 px-3.5 h-12 focus-within:bg-white focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-600/20 transition-all">
            <Search className="w-4 h-4 text-slate-400 mr-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by stop name (e.g. Paradise, Ameerpet, Koti) or code..."
              className="w-full bg-transparent text-sm text-slate-900 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Stops Grid */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
          <span>{stops.length} Bus Stops Found</span>
          {userLocation && <span className="text-teal-700">Sorted by walking distance</span>}
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
            <span className="text-sm">Loading bus stops...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {stops.map((stop) => (
              <StopCard key={stop.id} stop={stop} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
