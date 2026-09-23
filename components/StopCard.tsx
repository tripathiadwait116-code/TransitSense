import React from "react";
import Link from "next/link";
import { BusStopDTO } from "@/types";
import { MapPin, Navigation, ArrowRight, Bus } from "lucide-react";
import { formatDistance } from "@/lib/utils";

interface StopCardProps {
  stop: BusStopDTO;
  incomingCount?: number;
}

export const StopCard: React.FC<StopCardProps> = ({ stop, incomingCount }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-elevated transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm leading-snug">{stop.name}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                  {stop.code}
                </span>
                <span className="text-xs text-slate-400">• {stop.city}</span>
              </div>
            </div>
          </div>

          {stop.distanceMeters !== undefined && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold">
              <Navigation className="w-3 h-3 text-teal-600" />
              {stop.distanceMeters < 1000
                ? `${stop.distanceMeters} m`
                : `${(stop.distanceMeters / 1000).toFixed(1)} km`}
            </span>
          )}
        </div>

        {stop.landmark && (
          <p className="mt-2.5 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center gap-1.5">
            <span className="font-medium text-slate-700">Landmark:</span>
            <span className="text-slate-600 truncate">{stop.landmark}</span>
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 flex items-center gap-1">
          <Bus className="w-3.5 h-3.5 text-teal-700" />
          <span>RTC Stop Point</span>
        </span>

        <Link
          href={`/stops/${stop.id}`}
          className="inline-flex items-center gap-1 text-teal-800 hover:text-teal-950 font-semibold"
        >
          <span>Arrival Board</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
