import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dataService } from "@/lib/dataService";
import { OccupancyIndicator } from "@/components/OccupancyIndicator";
import { TrafficIndicator } from "@/components/TrafficIndicator";
import { formatEta, formatDistance } from "@/lib/utils";
import {
  MapPin,
  Clock,
  Bus,
  ArrowLeft,
  Navigation,
  ArrowRight,
  Radio,
  CheckCircle2,
} from "lucide-react";

export const revalidate = 0;

export default async function StopDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await dataService.getStopById(params.id);

  if (!data) {
    notFound();
  }

  const { stop, incomingBuses } = data;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/stops"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-teal-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Stops Directory</span>
        </Link>
      </div>

      {/* Stop Overview Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-teal-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{stop.name}</h1>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-mono">
                <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  Code: {stop.code}
                </span>
                <span>• {stop.city}</span>
              </div>
            </div>
          </div>

          <div className="text-right text-xs">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Active Transit Station</span>
            </span>
          </div>
        </div>

        {stop.landmark && (
          <div className="pt-3 border-t border-slate-100 text-xs text-slate-600">
            <span className="font-bold text-slate-800">Station Landmark:</span> {stop.landmark}
          </div>
        )}
      </div>

      {/* Live Arrival Board */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              Real-time Arrival Board
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-0.5">Upcoming Incoming Buses</h2>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            {incomingBuses.length} Buses En Route
          </span>
        </div>

        {incomingBuses.length > 0 ? (
          <div className="space-y-3.5">
            {incomingBuses.map((item) => (
              <div
                key={item.busId}
                className="bg-slate-50 hover:bg-white rounded-xl border border-slate-200 p-4 transition-all duration-200 hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Bus Number & Destination */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-teal-800 text-white font-black text-base flex items-center justify-center shrink-0 shadow-sm">
                    {item.busNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        Bus {item.busNumber}
                      </span>
                      <span className="text-xs font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        Route {item.routeNumber}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                      <span>Towards:</span>
                      <span className="font-bold text-teal-900">{item.destination}</span>
                    </div>
                  </div>
                </div>

                {/* ETA Countdown & Distance */}
                <div className="flex items-center gap-6">
                  <div className="text-left md:text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-400">
                      Estimated Arrival
                    </div>
                    <div className="text-xl font-black text-teal-900 flex items-center gap-1">
                      <Clock className="w-4 h-4 text-teal-600" />
                      <span>{formatEta(item.etaMinutes)}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {formatDistance(item.distanceKm)} away
                    </div>
                  </div>

                  {/* Occupancy chip */}
                  <div className="hidden sm:block">
                    <OccupancyIndicator occupancy={item.occupancy} compact={true} />
                  </div>

                  <Link
                    href={`/track?bus=${item.busId}`}
                    className="px-3.5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <span>Track</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 space-y-2">
            <Bus className="w-8 h-8 text-slate-300 mx-auto" />
            <div className="font-bold text-slate-700">No Incoming Buses Right Now</div>
            <p className="text-xs max-w-sm mx-auto">
              No active buses are currently within arrival range of {stop.name}. Check back in a few minutes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
