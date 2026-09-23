"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Bus, MapPin, Milestone, ArrowRight, X, Loader2 } from "lucide-react";
import { BusDTO, RouteDTO, BusStopDTO } from "@/types";

interface SearchBarProps {
  placeholder?: string;
  size?: "md" | "lg";
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search by bus number (e.g. 218), route, or stop...",
  size = "md",
  autoFocus = false,
}) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ buses: BusDTO[]; routes: RouteDTO[]; stops: BusStopDTO[] }>({
    buses: [],
    routes: [],
    stops: [],
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ buses: [], routes: [], stops: [] });
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const json = await res.json();
        if (json.success && json.data) {
          setResults(json.data);
          setIsOpen(true);
        }
      } catch (err) {
        console.error("Search fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (url: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(url);
  };

  const hasAnyResults = results.buses.length > 0 || results.routes.length > 0 || results.stops.length > 0;

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={`relative flex items-center bg-white rounded-xl border transition-all duration-200 shadow-sm focus-within:shadow-md focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-600/20 ${
          size === "lg" ? "h-14 px-4 text-base" : "h-11 px-3 text-sm"
        }`}
      >
        <Search className="w-5 h-5 text-slate-400 shrink-0 mr-2.5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (hasAnyResults) setIsOpen(true);
          }}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none"
        />

        {isLoading && <Loader2 className="w-4 h-4 text-teal-600 animate-spin shrink-0 ml-2" />}

        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-elevated z-50 overflow-hidden max-h-[420px] overflow-y-auto divide-y divide-slate-100">
          {!hasAnyResults && !isLoading && (
            <div className="p-4 text-center text-sm text-slate-500">
              No matching buses, routes, or stops found for &quot;{query}&quot;.
            </div>
          )}

          {/* Buses Section */}
          {results.buses.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Bus className="w-3.5 h-3.5 text-teal-600" />
                <span>Buses</span>
              </div>
              {results.buses.map((bus) => (
                <button
                  key={bus.id}
                  onClick={() => handleSelect(`/track?bus=${bus.id}`)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-md bg-teal-800 text-white text-xs font-bold flex items-center justify-center">
                      {bus.busNumber}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-slate-800 group-hover:text-teal-900">
                        Bus {bus.busNumber} • {bus.registrationNumber}
                      </div>
                      <div className="text-xs text-slate-500 truncate max-w-[280px]">
                        {bus.route?.routeName || "Telangana RTC Special"}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-teal-700 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    <span>Track</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Routes Section */}
          {results.routes.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Milestone className="w-3.5 h-3.5 text-blue-600" />
                <span>Routes</span>
              </div>
              {results.routes.map((route) => (
                <button
                  key={route.id}
                  onClick={() => handleSelect(`/routes/${route.id}`)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-md bg-blue-700 text-white text-xs font-bold flex items-center justify-center">
                      {route.routeNumber}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-slate-800 group-hover:text-blue-900">
                        {route.routeName}
                      </div>
                      <div className="text-xs text-slate-500">
                        {route.startPoint} ⇄ {route.destination}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-blue-700 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    <span>Stops</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Stops Section */}
          {results.stops.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>Bus Stops</span>
              </div>
              {results.stops.map((stop) => (
                <button
                  key={stop.id}
                  onClick={() => handleSelect(`/stops/${stop.id}`)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-amber-700" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800 group-hover:text-amber-900">
                        {stop.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {stop.code} • {stop.landmark || stop.city}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-amber-800 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    <span>Arrivals</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
