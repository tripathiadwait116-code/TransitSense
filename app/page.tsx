import React from "react";
import Link from "next/link";
import { dataService } from "@/lib/dataService";
import { BusCard } from "@/components/BusCard";
import { RouteCard } from "@/components/RouteCard";
import { SearchBar } from "@/components/SearchBar";
import {
  Radio,
  MapPin,
  Route,
  Activity,
  Users,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Server,
  Cpu,
  Smartphone,
  Navigation,
  CheckCircle2,
  Clock,
  Bus,
} from "lucide-react";

export const revalidate = 0;

export default async function HomePage() {
  const [buses, routes, stops, stats] = await Promise.all([
    dataService.getBuses(),
    dataService.getRoutes(),
    dataService.getStops(),
    dataService.getAdminStats(),
  ]);

  const activeBuses = buses.filter((b) => b.status === "ACTIVE" || b.status === "DELAYED");

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-900 via-teal-950 to-slate-900 text-white pt-16 pb-24 px-4 sm:px-6 overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-800/80 border border-teal-600/50 text-teal-200 text-xs font-semibold shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Telangana Public Transport Telemetry Initiative</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Smart Bus Tracking for <span className="text-teal-400">Telangana</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Track buses in real time, check accurate arrival times, understand traffic delays, and plan your daily journey with intelligent public transport telemetry.
          </p>

          {/* Main Hero Search Interface */}
          <div className="max-w-3xl mx-auto mt-8 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-official border border-white/20 text-slate-900 text-left">
            <div className="mb-3 text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between">
              <span>Find Any Bus, Route, or Stop in Telangana</span>
              <span className="text-teal-700 font-semibold text-[11px]">Instant Telemetry</span>
            </div>

            <SearchBar size="lg" placeholder="Search by bus number (e.g. 218), route (e.g. Koti to Patancheru), or stop..." />

            {/* Quick Action Tags */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-slate-400 font-medium">Popular:</span>
                {["218", "25A", "10H", "221", "290"].map((num) => (
                  <Link
                    key={num}
                    href={`/track?busNumber=${num}`}
                    className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-teal-50 hover:text-teal-900 border border-slate-200 text-slate-700 font-bold transition-colors"
                  >
                    Bus {num}
                  </Link>
                ))}
              </div>

              <Link
                href="/track"
                className="text-teal-800 hover:text-teal-950 font-bold flex items-center gap-1 group"
              >
                <span>Open Live Fleet Map</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6">
            <Link
              href="/track"
              className="bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/10 p-3.5 rounded-xl text-center group transition-all"
            >
              <div className="w-10 h-10 mx-auto rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
                <Radio className="w-5 h-5" />
              </div>
              <div className="font-bold text-sm text-white">Track a Bus</div>
              <div className="text-[11px] text-slate-300 mt-0.5">Live GPS & ETA</div>
            </Link>

            <Link
              href="/stops"
              className="bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/10 p-3.5 rounded-xl text-center group transition-all"
            >
              <div className="w-10 h-10 mx-auto rounded-lg bg-sky-500/20 text-sky-300 flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="font-bold text-sm text-white">Find Nearby Stop</div>
              <div className="text-[11px] text-slate-300 mt-0.5">GPS Proximity</div>
            </Link>

            <Link
              href="/routes"
              className="bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/10 p-3.5 rounded-xl text-center group transition-all"
            >
              <div className="w-10 h-10 mx-auto rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
                <Route className="w-5 h-5" />
              </div>
              <div className="font-bold text-sm text-white">View Routes</div>
              <div className="text-[11px] text-slate-300 mt-0.5">Stops & Schedules</div>
            </Link>

            <Link
              href="/report"
              className="bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/10 p-3.5 rounded-xl text-center group transition-all"
            >
              <div className="w-10 h-10 mx-auto rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="font-bold text-sm text-white">Report Grievance</div>
              <div className="text-[11px] text-slate-300 mt-0.5">Delays & Crowding</div>
            </Link>
          </div>
        </div>
      </section>

      {/* Real-time Fleet Status Snapshot Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-14 relative z-20">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-elevated p-6 grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="text-center md:text-left md:pr-4">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold text-slate-500 uppercase">
              <Bus className="w-4 h-4 text-teal-700" />
              <span>Active Fleet</span>
            </div>
            <div className="text-3xl font-black text-slate-900 mt-1">{stats.activeBuses} Buses</div>
            <div className="text-xs text-emerald-600 font-medium mt-0.5 flex items-center justify-center md:justify-start gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Live on Corridors</span>
            </div>
          </div>

          <div className="text-center md:text-left md:px-4 pt-4 md:pt-0">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold text-slate-500 uppercase">
              <Route className="w-4 h-4 text-blue-700" />
              <span>Covered Routes</span>
            </div>
            <div className="text-3xl font-black text-slate-900 mt-1">{stats.totalRoutes} Express Lines</div>
            <div className="text-xs text-slate-500 mt-0.5">{stats.totalStops} Geotagged Stops</div>
          </div>

          <div className="text-center md:text-left md:px-4 pt-4 md:pt-0">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold text-slate-500 uppercase">
              <Users className="w-4 h-4 text-purple-700" />
              <span>Avg Occupancy</span>
            </div>
            <div className="text-3xl font-black text-slate-900 mt-1">{stats.fleetOccupancyAverage}%</div>
            <div className="text-xs text-teal-700 font-medium mt-0.5">Moderate Seating Level</div>
          </div>

          <div className="text-center md:text-left md:pl-4 pt-4 md:pt-0">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold text-slate-500 uppercase">
              <Activity className="w-4 h-4 text-amber-600" />
              <span>Telemetry State</span>
            </div>
            <div className="text-2xl font-black text-amber-700 mt-1">Simulation Mode</div>
            <div className="text-xs text-slate-500 mt-0.5">Synthetic GPS Telemetry</div>
          </div>
        </div>
      </section>

      {/* Live Tracked Buses Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Real-time Fleet Snapshot
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Buses Currently Operating
            </h2>
          </div>
          <Link
            href="/track"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-800 hover:text-teal-950"
          >
            <span>View Full Interactive Map</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeBuses.slice(0, 6).map((bus) => (
            <BusCard key={bus.id} bus={bus} />
          ))}
        </div>
      </section>

      {/* Popular Routes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Transit Corridors
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Popular Telangana Express Routes
            </h2>
          </div>
          <Link
            href="/routes"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-800 hover:text-teal-950"
          >
            <span>Browse All {routes.length} Routes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {routes.slice(0, 6).map((route) => (
            <RouteCard key={route.id} route={route} />
          ))}
        </div>
      </section>

      {/* How the System Works Section */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
              Technical Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-1 text-white">
              How Telangana Smart RTC Works
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              From GPS telemetry sensors on buses to real-time arrival estimates on commuter phones.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative">
            <div className="bg-slate-800/80 border border-slate-700 p-5 rounded-2xl text-center space-y-2.5">
              <div className="w-12 h-12 mx-auto rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold">
                <Navigation className="w-6 h-6" />
              </div>
              <div className="font-bold text-sm text-white">1. GPS Telemetry</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                AIS-140 GPS devices or simulated telemetry stream live bus coordinates, speed, and heading every few seconds.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-5 rounded-2xl text-center space-y-2.5">
              <div className="w-12 h-12 mx-auto rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold">
                <Server className="w-6 h-6" />
              </div>
              <div className="font-bold text-sm text-white">2. Backend Ingestion</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Next.js Route Handlers securely ingest coordinates, validating geometry and updating server-side timestamps.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-5 rounded-2xl text-center space-y-2.5">
              <div className="w-12 h-12 mx-auto rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="font-bold text-sm text-white">3. Database Layer</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Prisma ORM stores audit history, route relations, bus telemetry logs, and stop schedules in PostgreSQL.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-5 rounded-2xl text-center space-y-2.5">
              <div className="w-12 h-12 mx-auto rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                <Cpu className="w-6 h-6" />
              </div>
              <div className="font-bold text-sm text-white">4. ETA & Traffic Engine</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Isolated algorithms dynamically calculate ETA based on distance, traffic congestion, and passenger dwell times.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-5 rounded-2xl text-center space-y-2.5">
              <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                <Smartphone className="w-6 h-6" />
              </div>
              <div className="font-bold text-sm text-white">5. Passenger Website</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Commuters view smooth live map markers, seat occupancy bars, and accurate countdown arrival timers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Prototype Notice / Student Project Disclaimer Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Engineering Prototype Notice
            </span>
            <h3 className="text-lg font-bold text-amber-950">
              Telangana Smart RTC — Student & Research Project
            </h3>
            <p className="text-xs text-amber-800/90 max-w-2xl leading-relaxed">
              This application is an educational prototype demonstrating modern intelligent transit architecture, real-time telemetry processing, and accessible public interface design. It is not an official portal of the Telangana State Road Transport Corporation (TSRTC).
            </p>
          </div>

          <Link
            href="/admin"
            className="whitespace-nowrap px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
          >
            Access Admin Console
          </Link>
        </div>
      </section>
    </div>
  );
}
