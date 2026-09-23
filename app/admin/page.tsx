import React from "react";
import Link from "next/link";
import { dataService } from "@/lib/dataService";
import { StatCard } from "@/components/StatCard";
import { BusMap } from "@/components/BusMap";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Bus,
  Route,
  MapPin,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Radio,
  ArrowRight,
  Activity,
  Users,
} from "lucide-react";
import { formatSpeed, formatTimestamp } from "@/lib/utils";

export const revalidate = 0;

export default async function AdminOverviewPage() {
  const [stats, buses, reports] = await Promise.all([
    dataService.getAdminStats(),
    dataService.getBuses(),
    dataService.getReports(),
  ]);

  const activeBuses = buses.filter((b) => b.status === "ACTIVE");

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Transit Fleet Command Center
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time telemetry overview, fleet dispatch management, and passenger issue resolution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/buses"
            className="px-3.5 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
          >
            Manage Buses
          </Link>
          <Link
            href="/admin/reports"
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-colors"
          >
            View Grievances ({stats.pendingReportsCount})
          </Link>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Active Fleet"
          value={stats.activeBuses}
          subtitle={`${stats.totalBuses} Total Registered Buses`}
          icon={Bus}
          color="teal"
        />
        <StatCard
          label="Corridor Routes"
          value={stats.totalRoutes}
          subtitle={`${stats.totalStops} Geotagged Stops`}
          icon={Route}
          color="blue"
        />
        <StatCard
          label="Delayed Buses"
          value={stats.delayedBuses}
          subtitle="Traffic bottlenecks reported"
          icon={Clock}
          color="amber"
        />
        <StatCard
          label="Pending Reports"
          value={stats.pendingReportsCount}
          subtitle={`${stats.totalReportsCount} total submissions`}
          icon={AlertTriangle}
          color="rose"
        />
      </div>

      {/* Live Fleet Monitoring Section with Map */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Radio className="w-4 h-4 text-teal-700 animate-pulse" />
              <span>Live Fleet Telemetry Monitoring</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Current positions of simulated buses traversing Hyderabad corridors.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {buses.length} Transponders Active
          </span>
        </div>

        <BusMap buses={buses} height="460px" />
      </div>

      {/* Active Fleet Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-700" />
            <span>Active Bus Fleet Telemetry Snapshot</span>
          </h2>
          <Link
            href="/admin/buses"
            className="text-xs font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1"
          >
            <span>View All Fleet</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold tracking-wider">
                <th className="py-2.5 px-3">Bus</th>
                <th className="py-2.5 px-3">Route</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Speed</th>
                <th className="py-2.5 px-3">Next Stop</th>
                <th className="py-2.5 px-3">Occupancy</th>
                <th className="py-2.5 px-3">Last Ping</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {buses.map((bus) => (
                <tr key={bus.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">Bus {bus.busNumber}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{bus.registrationNumber}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div>{bus.route?.routeName || "Special Charter"}</div>
                    <div className="text-[10px] text-slate-400">Route #{bus.route?.routeNumber}</div>
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={bus.status} size="sm" />
                  </td>
                  <td className="py-3 px-3">
                    {bus.currentLocation ? formatSpeed(bus.currentLocation.speed) : "0 km/h"}
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-teal-900 font-bold truncate max-w-[150px]">
                      {bus.currentLocation?.nextStopName || "—"}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    {bus.currentOccupancy ? (
                      <span className="font-bold">
                        {bus.currentOccupancy.occupiedSeats}/{bus.currentOccupancy.totalCapacity} ({bus.currentOccupancy.occupancyPercentage}%)
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    {bus.currentLocation?.timestamp ? formatTimestamp(bus.currentLocation.timestamp) : "Just now"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
