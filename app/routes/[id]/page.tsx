import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dataService } from "@/lib/dataService";
import { BusMap } from "@/components/BusMap";
import { BusCard } from "@/components/BusCard";
import { TrafficIndicator } from "@/components/TrafficIndicator";
import { ArrowLeft, ArrowRight, Milestone, MapPin, Bus, Clock, Shield } from "lucide-react";

export const revalidate = 0;

export default async function RouteDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const route = await dataService.getRouteById(params.id);

  if (!route) {
    notFound();
  }

  const busesOnRoute = await dataService.getBuses({ routeId: route.id });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/routes"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-teal-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Routes</span>
        </Link>
      </div>

      {/* Route Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-800 text-white font-black text-lg flex items-center justify-center shadow-sm">
              {route.routeNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">{route.routeName}</h1>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span>{route.startPoint}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-teal-800">{route.destination}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {route.trafficCondition && (
              <TrafficIndicator
                condition={route.trafficCondition}
                delayMinutes={route.delayMinutes}
              />
            )}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="text-slate-400 font-medium">Total Distance</div>
            <div className="text-lg font-bold text-slate-900 mt-0.5">{route.totalDistanceKm} km</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="text-slate-400 font-medium">Estimated Duration</div>
            <div className="text-lg font-bold text-slate-900 mt-0.5">{route.estimatedDurationMin} mins</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="text-slate-400 font-medium">Total Bus Stops</div>
            <div className="text-lg font-bold text-slate-900 mt-0.5">{route.routeStops?.length ?? 0} stops</div>
          </div>
          <div className="bg-teal-50/70 p-3 rounded-xl border border-teal-100">
            <div className="text-teal-700 font-medium">Active Fleet</div>
            <div className="text-lg font-bold text-teal-900 mt-0.5">{busesOnRoute.length} Buses running</div>
          </div>
        </div>
      </div>

      {/* Main Section: Interactive Map + Stop List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Corridor Polyline & Geometry</span>
              <span className="text-teal-700">{busesOnRoute.length} Live Buses on Route</span>
            </div>
            <BusMap buses={busesOnRoute} route={route} height="480px" />
          </div>

          {/* Active Buses on this route */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bus className="w-4 h-4 text-teal-700" />
              <span>Active Buses Operating Along This Line</span>
            </h3>

            {busesOnRoute.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {busesOnRoute.map((bus) => (
                  <BusCard key={bus.id} bus={bus} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-sm text-slate-500">
                No active buses currently reported on Route {route.routeNumber}.
              </div>
            )}
          </div>
        </div>

        {/* Ordered Stops Sequence */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Milestone className="w-4 h-4 text-teal-700" />
              <span>Ordered Stop Sequence</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">From Start to Terminus</span>
          </div>

          <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
            {route.routeStops?.map((rs, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === (route.routeStops?.length ?? 0) - 1;

              return (
                <div key={rs.id} className="relative flex items-start gap-3 pl-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10 ${
                      isFirst
                        ? "bg-emerald-600 text-white ring-4 ring-emerald-50"
                        : isLast
                        ? "bg-rose-600 text-white ring-4 ring-rose-50"
                        : "bg-teal-700 text-white"
                    }`}
                  >
                    {rs.stopSequence}
                  </div>

                  <div className="flex-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <Link
                        href={`/stops/${rs.stop.id}`}
                        className="font-bold text-slate-900 hover:text-teal-800 transition-colors"
                      >
                        {rs.stop.name}
                      </Link>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {rs.stop.code} {rs.stop.landmark ? `• ${rs.stop.landmark}` : ""}
                      </div>
                    </div>

                    {!isLast && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        {rs.distanceToNextKm} km
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
