import React from "react";
import { BusOccupancyDTO } from "@/types";
import { getOccupancyColor } from "@/lib/utils";
import { Users, Armchair } from "lucide-react";

interface OccupancyIndicatorProps {
  occupancy?: BusOccupancyDTO | null;
  showBar?: boolean;
  compact?: boolean;
}

export const OccupancyIndicator: React.FC<OccupancyIndicatorProps> = ({
  occupancy,
  showBar = true,
  compact = false,
}) => {
  if (!occupancy) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <Users className="w-3.5 h-3.5" />
        <span>Occupancy unknown</span>
      </div>
    );
  }

  const colorInfo = getOccupancyColor(occupancy.status);

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${colorInfo.bg}`}
        title={`${occupancy.availableSeats} seats available out of ${occupancy.totalCapacity}`}
      >
        <Armchair className="w-3 h-3" />
        <span>{occupancy.availableSeats} free</span>
      </span>
    );
  }

  // Available seat color urgency
  const seatsLeft = occupancy.availableSeats;
  const seatsPillColor =
    seatsLeft === 0
      ? "bg-red-100 text-red-700 border-red-300"
      : seatsLeft <= 5
      ? "bg-orange-100 text-orange-700 border-orange-300"
      : seatsLeft <= 15
      ? "bg-yellow-50 text-yellow-700 border-yellow-300"
      : "bg-emerald-50 text-emerald-700 border-emerald-300";

  return (
    <div className="space-y-2 w-full">
      {/* Available Seats — prominent pill */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
          <Users className="w-3.5 h-3.5 text-slate-400" />
          <span>Occupancy</span>
          <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold uppercase ${colorInfo.bg}`}>
            {colorInfo.label}
          </span>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-bold text-sm ${seatsPillColor}`}>
          <Armchair className="w-3.5 h-3.5" />
          {seatsLeft === 0 ? "Full" : `${seatsLeft} seats free`}
        </span>
      </div>

      {/* Progress bar */}
      {showBar && (
        <div className="space-y-1">
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${colorInfo.bar}`}
              style={{ width: `${Math.min(100, Math.max(5, occupancy.occupancyPercentage))}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>{occupancy.occupiedSeats} occupied</span>
            <span>{occupancy.totalCapacity} total capacity</span>
          </div>
        </div>
      )}
    </div>
  );
};
