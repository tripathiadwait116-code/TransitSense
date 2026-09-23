import React from "react";
import Link from "next/link";
import { BusDTO } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { OccupancyIndicator } from "./OccupancyIndicator";
import { TrafficIndicator } from "./TrafficIndicator";
import { Bus, ArrowRight, Navigation, Clock, MapPin, Armchair } from "lucide-react";
import { formatEta, formatDistance } from "@/lib/utils";

interface BusCardProps {
  bus: BusDTO;
  highlighted?: boolean;
}

export const BusCard: React.FC<BusCardProps> = ({ bus, highlighted = false }) => {
  const nextStop = bus.currentLocation?.nextStopName;
  const etaMinutes = bus.currentLocation?.etaToNextMin ?? 0;
  const distance = bus.currentLocation?.distanceToNextKm;

  return (
    <div
      className={`bg-white rounded-xl border transition-all duration-200 hover:shadow-elevated p-4 flex flex-col justify-between ${
        highlighted ? "border-teal-500 ring-2 ring-teal-500/20 shadow-md" : "border-slate-200 shadow-sm"
      }`}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-teal-800 text-white flex items-center justify-center font-black text-sm shadow-sm">
              <Bus className="w-5 h-5 text-teal-200 mr-0.5" />
              <span>{bus.busNumber}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">{bus.busNumber}</h3>
                <span className="text-xs text-slate-400 font-mono bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                  {bus.registrationNumber}
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                {bus.route ? bus.route.routeName : "Telangana RTC Special"}
              </p>
            </div>
          </div>
          <StatusBadge status={bus.status} size="sm" />
        </div>

        {/* Available Seats quick badge */}
        {bus.currentOccupancy && (
          <div
            className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-bold w-full justify-center ${
              bus.currentOccupancy.availableSeats === 0
                ? "bg-red-50 text-red-700 border-red-200"
                : bus.currentOccupancy.availableSeats <= 5
                ? "bg-orange-50 text-orange-700 border-orange-200"
                : bus.currentOccupancy.availableSeats <= 15
                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}
          >
            <Armchair className="w-3.5 h-3.5" />
            {bus.currentOccupancy.availableSeats === 0
              ? "No seats available — Bus Full"
              : `${bus.currentOccupancy.availableSeats} seats available`}
          </div>
        )}

        {/* Route Details */}
        {bus.route && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 rounded-lg p-2 border border-slate-100">
            <span className="font-semibold text-slate-800">{bus.route.startPoint}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold text-teal-800">{bus.route.destination}</span>
          </div>
        )}

        {/* Live Status Row */}
        {bus.currentLocation && (
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-teal-50/70 border border-teal-100 rounded-lg p-2">
              <div className="text-[10px] text-teal-700 font-medium flex items-center gap-1">
                <Clock className="w-3 h-3 text-teal-600" />
                <span>Next Stop</span>
              </div>
              <div className="font-bold text-teal-950 truncate mt-0.5" title={nextStop || ""}>
                {nextStop || "In Transit"}
              </div>
              <div className="text-[11px] font-semibold text-teal-700 mt-0.5">
                ETA: {formatEta(etaMinutes)}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2">
              <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                <Navigation className="w-3 h-3 text-slate-400 rotate-45" />
                <span>Live Telemetry</span>
              </div>
              <div className="font-bold text-slate-900 mt-0.5">
                {Math.round(bus.currentLocation.speed)} km/h
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {distance ? `${formatDistance(distance)} to stop` : "Tracking active"}
              </div>
            </div>
          </div>
        )}

        {/* Occupancy Section */}
        <div className="mt-3 pt-2.5 border-t border-slate-100">
          <OccupancyIndicator occupancy={bus.currentOccupancy} showBar={true} />
        </div>

        {/* Traffic Delay Chip if available */}
        {bus.currentTraffic && bus.currentTraffic.condition !== "LOW" && (
          <div className="mt-2.5">
            <TrafficIndicator
              condition={bus.currentTraffic.condition}
              delayMinutes={bus.currentTraffic.delayMinutes}
              description={bus.currentTraffic.description}
            />
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
          Simulation Mode
        </span>

        <Link
          href={`/track?bus=${bus.id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
        >
          <span>Live Track</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
