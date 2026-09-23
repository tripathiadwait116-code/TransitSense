"use client";

import React, { useState, useEffect } from "react";
import { RouteDTO } from "@/types";
import { Route, Milestone, ArrowRight, Loader2, RefreshCw } from "lucide-react";

export default function AdminRoutesPage() {
  const [routes, setRoutes] = useState<RouteDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRoutes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/routes");
      const json = await res.json();
      if (json.success) setRoutes(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Corridor Route Networks
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Overview of designated transit lines, terminal points, and stop segments.
          </p>
        </div>

        <button
          onClick={fetchRoutes}
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
            <span className="text-xs">Loading corridor routes...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-4">Route</th>
                  <th className="py-3 px-4">Start Point</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Distance</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Active Buses</th>
                  <th className="py-3 px-4">Traffic Condition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {routes.map((route) => (
                  <tr key={route.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-7 h-7 rounded-md bg-teal-800 text-white font-extrabold flex items-center justify-center text-xs">
                        {route.routeNumber}
                      </span>
                      <span>{route.routeName}</span>
                    </td>
                    <td className="py-3.5 px-4">{route.startPoint}</td>
                    <td className="py-3.5 px-4 text-teal-900 font-bold">{route.destination}</td>
                    <td className="py-3.5 px-4">{route.totalDistanceKm} km</td>
                    <td className="py-3.5 px-4">{route.estimatedDurationMin} mins</td>
                    <td className="py-3.5 px-4 font-bold text-teal-800">
                      {route.activeBusesCount ?? 1} in service
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {route.trafficCondition || "LOW"}
                      </span>
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
