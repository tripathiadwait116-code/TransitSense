import React from "react";
import { formatEta, formatDistance } from "@/lib/utils";
import { Clock, MapPin, Navigation } from "lucide-react";

interface ETAIndicatorProps {
  etaMinutes: number;
  nextStopName?: string | null;
  distanceKm?: number;
  trafficDelayMinutes?: number;
  speed?: number;
  size?: "sm" | "md" | "lg";
}

export const ETAIndicator: React.FC<ETAIndicatorProps> = ({
  etaMinutes,
  nextStopName,
  distanceKm,
  trafficDelayMinutes = 0,
  speed,
  size = "md",
}) => {
  const isArriving = etaMinutes <= 1;

  if (size === "sm") {
    return (
      <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-800">
        <Clock className="w-3.5 h-3.5 text-teal-600" />
        <span>{formatEta(etaMinutes)}</span>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between shadow-sm">
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <MapPin className="w-3.5 h-3.5 text-teal-600" />
          <span>Next Stop</span>
        </div>
        <div className="font-bold text-slate-900 text-sm truncate max-w-[200px]">
          {nextStopName || "Upcoming Bus Stop"}
        </div>
        {distanceKm !== undefined && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>{formatDistance(distanceKm)} away</span>
            {speed !== undefined && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Navigation className="w-3 h-3 text-slate-400 rotate-45" />
                  {Math.round(speed)} km/h
                </span>
              </>
            )}
          </div>
        )}
      </div>

      <div className="text-right">
        <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
          Estimated Arrival
        </div>
        <div
          className={`text-xl font-black ${
            isArriving ? "text-emerald-600 animate-pulse" : "text-teal-900"
          }`}
        >
          {formatEta(etaMinutes)}
        </div>
        {trafficDelayMinutes > 0 && (
          <div className="text-[10px] text-amber-700 font-semibold">
            (Includes +{trafficDelayMinutes}m delay)
          </div>
        )}
      </div>
    </div>
  );
};
