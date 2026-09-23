import React from "react";
import Link from "next/link";
import { RouteDTO } from "@/types";
import { TrafficIndicator } from "./TrafficIndicator";
import { ArrowRight, MapPin, Clock, Bus, Milestone } from "lucide-react";

interface RouteCardProps {
  route: RouteDTO;
}

export const RouteCard: React.FC<RouteCardProps> = ({ route }) => {
  const stopCount = route.routeStops?.length || 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-elevated transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-lg bg-teal-800 text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
              {route.routeNumber}
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{route.routeName}</h3>
              <p className="text-xs text-slate-400">Telangana Express Corridor</p>
            </div>
          </div>
          {route.trafficCondition && route.trafficCondition !== "LOW" ? (
            <TrafficIndicator condition={route.trafficCondition} delayMinutes={route.delayMinutes} compact={true} />
          ) : (
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Clear Route
            </span>
          )}
        </div>

        {/* Start to Destination */}
        <div className="mt-3.5 space-y-1.5 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="font-medium text-slate-900 truncate">{route.startPoint}</span>
          </div>
          <div className="ml-1 border-l-2 border-dashed border-slate-200 h-3" />
          <div className="flex items-center gap-2 text-slate-700">
            <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
            <span className="font-medium text-teal-900 truncate">{route.destination}</span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
            <div className="text-[10px] text-slate-500 font-medium">Distance</div>
            <div className="font-bold text-slate-800 mt-0.5">{route.totalDistanceKm} km</div>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
            <div className="text-[10px] text-slate-500 font-medium">Est. Time</div>
            <div className="font-bold text-slate-800 mt-0.5">{route.estimatedDurationMin} mins</div>
          </div>
          <div className="bg-teal-50/60 p-2 rounded-lg border border-teal-100/80">
            <div className="text-[10px] text-teal-700 font-medium">Active Buses</div>
            <div className="font-bold text-teal-900 mt-0.5">{route.activeBusesCount ?? 1} on line</div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 flex items-center gap-1 font-medium">
          <Milestone className="w-3.5 h-3.5 text-slate-400" />
          {stopCount > 0 ? `${stopCount} Major Stops` : "Direct Express"}
        </span>

        <Link
          href={`/routes/${route.id}`}
          className="inline-flex items-center gap-1 text-teal-800 hover:text-teal-950 font-semibold"
        >
          <span>View Stops</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
