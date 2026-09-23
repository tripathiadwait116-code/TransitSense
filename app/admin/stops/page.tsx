"use client";

import React, { useState, useEffect } from "react";
import { BusStopDTO } from "@/types";
import { MapPin, Loader2, RefreshCw } from "lucide-react";

export default function AdminStopsPage() {
  const [stops, setStops] = useState<BusStopDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStops = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/stops");
      const json = await res.json();
      if (json.success) setStops(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStops();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Bus Stops & Station Landmarks
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Registered transit boarding points, GPS coordinates, and landmark references.
          </p>
        </div>

        <button
          onClick={fetchStops}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
            <span className="text-xs">Loading transit stops...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-4">Stop Name</th>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Landmark</th>
                  <th className="py-3 px-4">Coordinates (Lat, Lng)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {stops.map((stop) => (
                  <tr key={stop.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                      <span>{stop.name}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-600">{stop.code}</td>
                    <td className="py-3.5 px-4">{stop.city}</td>
                    <td className="py-3.5 px-4 text-slate-500">{stop.landmark || "—"}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      {stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)}
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
