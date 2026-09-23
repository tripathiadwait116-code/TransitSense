"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BusDTO, RouteDTO } from "@/types";
import { BusMap } from "@/components/BusMap";
import { StatusBadge } from "@/components/StatusBadge";
import { OccupancyIndicator } from "@/components/OccupancyIndicator";
import { TrafficIndicator } from "@/components/TrafficIndicator";
import { ETAIndicator } from "@/components/ETAIndicator";
import {
  Bus,
  Search,
  Navigation,
  Clock,
  MapPin,
  RefreshCw,
  Play,
  Pause,
  ArrowRight,
  Milestone,
  Locate,
  AlertTriangle,
  Info,
  Layers,
} from "lucide-react";
import { formatDistance, formatSpeed, formatTimestamp } from "@/lib/utils";

function TrackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [buses, setBuses] = useState<BusDTO[]>([]);
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<RouteDTO | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAutoSimulating, setIsAutoSimulating] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locatingUser, setLocatingUser] = useState(false);

  // Fetch all buses
  const fetchBuses = useCallback(async () => {
    try {
      const res = await fetch("/api/buses");
      const json = await res.json();
      if (json.success && json.data) {
        setBuses(json.data);
        setLastUpdated(new Date());

        // Check if query param specifies bus
        const busParam = searchParams.get("bus") || searchParams.get("busNumber");
        if (busParam && !selectedBusId) {
          const match = json.data.find(
            (b: BusDTO) =>
              b.id.toLowerCase() === busParam.toLowerCase() ||
              b.busNumber.toLowerCase() === busParam.toLowerCase()
          );
          if (match) {
            setSelectedBusId(match.id);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch buses:", err);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams, selectedBusId]);

  // Initial fetch
  useEffect(() => {
    fetchBuses();
  }, [fetchBuses]);

  // Periodic Telemetry Simulation Tick
  useEffect(() => {
    if (!isAutoSimulating) return;

    const interval = setInterval(async () => {
      try {
        // Step simulation engine on backend
        await fetch("/api/simulation/tick?delta=4");
        await fetchBuses();
      } catch (err) {
        console.error("Simulation tick error:", err);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoSimulating, fetchBuses]);

  // Fetch route details for polyline when bus is selected
  useEffect(() => {
    if (!selectedBusId) return;

    const selected = buses.find((b) => b.id === selectedBusId);
    if (selected && selected.routeId) {
      fetch(`/api/routes/${selected.routeId}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data) {
            setSelectedRoute(json.data);
          }
        })
        .catch(console.error);
    } else {
      setSelectedRoute(null);
    }
  }, [selectedBusId, buses]);

  // Request browser location
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocatingUser(false);
      },
      (err) => {
        console.warn("Location permission denied:", err);
        setLocatingUser(false);
      }
    );
  };

  const selectedBus = buses.find((b) => b.id === selectedBusId) || buses[0] || null;

  // Filtered buses list for sidebar
  const filteredBuses = buses.filter((b) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.busNumber.toLowerCase().includes(q) ||
      b.registrationNumber.toLowerCase().includes(q) ||
      b.route?.routeName.toLowerCase().includes(q) ||
      b.currentLocation?.nextStopName?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Live Bus Telemetry & Tracking
            </h1>
            <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300">
              Simulation Mode
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tracking active RTC buses across Hyderabad & Secunderabad corridors. Last telemetry sync:{" "}
            <span className="font-semibold text-slate-700">{formatTimestamp(lastUpdated)}</span>
          </p>
        </div>

        {/* Simulation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoSimulating(!isAutoSimulating)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              isAutoSimulating
                ? "bg-teal-50 border-teal-300 text-teal-800"
                : "bg-slate-100 border-slate-300 text-slate-700"
            }`}
          >
            {isAutoSimulating ? (
              <>
                <Pause className="w-3.5 h-3.5 text-teal-700" />
                <span>Pause Sim</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-slate-700" />
                <span>Resume Sim</span>
              </>
            )}
          </button>

          <button
            onClick={fetchBuses}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Refresh now"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleGetLocation}
            disabled={locatingUser}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
              userLocation
                ? "bg-blue-50 border-blue-300 text-blue-800"
                : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
            }`}
          >
            <Locate className={`w-3.5 h-3.5 ${locatingUser ? "animate-spin text-blue-600" : "text-blue-600"}`} />
            <span>{userLocation ? "Location Synced" : "My Location"}</span>
          </button>
        </div>
      </div>

      {/* Main Tracking Content Area: Map (Left/Center) + Telemetry Details Sidebar (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Map & Bus Selector */}
        <div className="lg:col-span-8 space-y-4">
          <BusMap
            buses={buses}
            selectedBusId={selectedBus?.id || null}
            onSelectBus={(b) => setSelectedBusId(b.id)}
            route={selectedRoute}
            userLocation={userLocation}
            height="560px"
          />

          {/* Quick Bus Selector Strip */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Select Active Bus to Track</span>
              <span className="text-[11px] text-teal-700 font-semibold">{buses.length} in service</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {buses.map((bus) => {
                const isSelected = selectedBus?.id === bus.id;
                return (
                  <button
                    key={bus.id}
                    onClick={() => setSelectedBusId(bus.id)}
                    className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                      isSelected
                        ? "bg-teal-800 border-teal-900 text-white shadow-md scale-105"
                        : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                    }`}
                  >
                    <Bus className={`w-4 h-4 ${isSelected ? "text-teal-200" : "text-slate-400"}`} />
                    <span>Bus {bus.busNumber}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded ${
                        isSelected ? "bg-teal-950 text-teal-200" : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {bus.status}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Telemetry & Next Stop Timeline */}
        <div className="lg:col-span-4 space-y-5">
          {selectedBus ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
              {/* Bus Title & Badges */}
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-12 h-12 rounded-xl bg-teal-800 text-white flex items-center justify-center font-black text-lg shadow-sm">
                      {selectedBus.busNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-black text-slate-900">
                          Bus {selectedBus.busNumber}
                        </h2>
                      </div>
                      <span className="text-xs font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        {selectedBus.registrationNumber}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={selectedBus.status} />
                </div>

                {selectedBus.route && (
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Route</div>
                    <div className="font-bold text-slate-900 mt-0.5">{selectedBus.route.routeName}</div>
                    <div className="text-slate-500 mt-0.5 flex items-center gap-1.5">
                      <span>{selectedBus.route.startPoint}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <span className="font-semibold text-teal-800">{selectedBus.route.destination}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic ETA Indicator Component */}
              {selectedBus.currentLocation && (
                <ETAIndicator
                  etaMinutes={selectedBus.currentLocation.etaToNextMin}
                  nextStopName={selectedBus.currentLocation.nextStopName}
                  distanceKm={selectedBus.currentLocation.distanceToNextKm}
                  speed={selectedBus.currentLocation.speed}
                  trafficDelayMinutes={selectedBus.currentTraffic?.delayMinutes}
                />
              )}

              {/* Live Telemetry Sensor Card */}
              {selectedBus.currentLocation && (
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-3.5 space-y-2.5 text-xs">
                  <div className="font-bold text-slate-700 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-teal-600" />
                      <span>GPS Telemetry Data</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">AIS-140 Standard</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-600">
                    <div className="bg-white p-2 rounded-lg border border-slate-100">
                      <div className="text-[10px] text-slate-400">Current Speed</div>
                      <div className="font-bold text-slate-900 text-sm mt-0.5">
                        {formatSpeed(selectedBus.currentLocation.speed)}
                      </div>
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-slate-100">
                      <div className="text-[10px] text-slate-400">Bearing Heading</div>
                      <div className="font-bold text-slate-900 text-sm mt-0.5">
                        {Math.round(selectedBus.currentLocation.heading)}° (Compass)
                      </div>
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-slate-100 col-span-2">
                      <div className="text-[10px] text-slate-400">Coordinates (Lat, Long)</div>
                      <div className="font-mono text-xs font-semibold text-slate-800 mt-0.5">
                        {selectedBus.currentLocation.latitude.toFixed(5)}, {selectedBus.currentLocation.longitude.toFixed(5)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bus Occupancy System */}
              <div className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-2">
                <OccupancyIndicator occupancy={selectedBus.currentOccupancy} showBar={true} />
              </div>

              {/* Traffic Condition System */}
              {selectedBus.currentTraffic && (
                <div className="space-y-1.5">
                  <TrafficIndicator
                    condition={selectedBus.currentTraffic.condition}
                    delayMinutes={selectedBus.currentTraffic.delayMinutes}
                    description={selectedBus.currentTraffic.description}
                  />
                </div>
              )}

              {/* Ordered Stops Along Corridor */}
              {selectedRoute && selectedRoute.routeStops && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Milestone className="w-3.5 h-3.5 text-teal-600" />
                      <span>Corridor Stop Sequence</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      {selectedRoute.routeStops.length} stops
                    </span>
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-2 pr-1 text-xs divide-y divide-slate-100">
                    {selectedRoute.routeStops.map((rs, idx) => {
                      const isNext = rs.stop.name === selectedBus.currentLocation?.nextStopName;

                      return (
                        <div
                          key={rs.id}
                          className={`pt-2 flex items-center justify-between ${
                            isNext ? "bg-teal-50/70 p-2 rounded-lg font-bold text-teal-950" : "text-slate-600"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span
                              className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                                isNext ? "bg-teal-700 text-white" : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {rs.stopSequence}
                            </span>
                            <span className="truncate">{rs.stop.name}</span>
                          </div>

                          {isNext && (
                            <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full shrink-0">
                              Next Stop
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 space-y-2">
              <Bus className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="font-bold text-slate-700">No Bus Selected</div>
              <p className="text-xs">Choose any active bus on the map to inspect live telemetry.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-950"><div className="text-white animate-pulse">Loading tracker…</div></div>}>
      <TrackContent />
    </Suspense>
  );
}
