"use client";

import React, { useEffect, useRef, useState } from "react";
import { BusDTO, BusStopDTO, RouteDTO } from "@/types";
import { Bus, Navigation, MapPin, AlertTriangle, Layers, Locate } from "lucide-react";
import { formatEta } from "@/lib/utils";

interface BusMapProps {
  buses: BusDTO[];
  selectedBusId?: string | null;
  onSelectBus?: (bus: BusDTO) => void;
  route?: RouteDTO | null;
  stops?: BusStopDTO[];
  userLocation?: { lat: number; lng: number } | null;
  height?: string;
  zoom?: number;
  center?: [number, number];
}

export const BusMap: React.FC<BusMapProps> = ({
  buses,
  selectedBusId,
  onSelectBus,
  route,
  stops = [],
  userLocation,
  height = "520px",
  zoom = 13,
  center = [17.4399, 78.4983], // Default Hyderabad/Secunderabad
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const routeLayerRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize Leaflet Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      const L = (await import("leaflet")).default;

      if (!isMounted || !mapContainerRef.current) return;

      // Determine initial center
      const initialCenter = center;

      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: zoom,
        zoomControl: false,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // OpenStreetMap Tile Layer (Free, reliable, no API key required)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Telangana Smart RTC',
        maxZoom: 19,
      }).addTo(map);

      markersGroupRef.current = L.layerGroup().addTo(map);
      routeLayerRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
      setMapLoaded(true);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Route Polylines and Stops
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;

    const L = (window as any).L || (require("leaflet") as any);
    if (!L || !routeLayerRef.current) return;

    routeLayerRef.current.clearLayers();

    // 1. Draw Route Stops & Polyline
    if (route && route.routeStops && route.routeStops.length > 0) {
      const sortedStops = [...route.routeStops].sort((a, b) => a.stopSequence - b.stopSequence);
      const latLngs = sortedStops.map((rs) => [rs.stop.latitude, rs.stop.longitude]);

      // Route line
      const polyline = L.polyline(latLngs, {
        color: "#0d9488",
        weight: 5,
        opacity: 0.85,
        lineJoin: "round",
      }).addTo(routeLayerRef.current);

      // Stop markers
      sortedStops.forEach((rs, index) => {
        const isFirst = index === 0;
        const isLast = index === sortedStops.length - 1;

        const stopIcon = L.divIcon({
          className: "custom-stop-marker",
          html: `
            <div style="
              width: ${isFirst || isLast ? "22px" : "14px"};
              height: ${isFirst || isLast ? "22px" : "14px"};
              background: ${isFirst ? "#10b981" : isLast ? "#f43f5e" : "#0284c7"};
              border: 3px solid #ffffff;
              border-radius: 50%;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            "></div>
          `,
          iconSize: [isFirst || isLast ? 22 : 14, isFirst || isLast ? 22 : 14],
          iconAnchor: [isFirst || isLast ? 11 : 7, isFirst || isLast ? 11 : 7],
        });

        const stopMarker = L.marker([rs.stop.latitude, rs.stop.longitude], { icon: stopIcon });
        stopMarker.bindPopup(`
          <div style="font-family: system-ui; padding: 4px;">
            <div style="font-weight: 700; font-size: 13px; color: #0f172a;">${rs.stop.name}</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Stop #${rs.stopSequence} • ${rs.stop.code}</div>
            ${rs.stop.landmark ? `<div style="font-size: 11px; color: #0284c7; margin-top: 2px;">Near: ${rs.stop.landmark}</div>` : ""}
          </div>
        `);
        stopMarker.addTo(routeLayerRef.current);
      });

      // Fit route bounds if selected
      try {
        mapInstanceRef.current.fitBounds(polyline.getBounds(), { padding: [50, 50] });
      } catch (err) {}
    } else if (stops && stops.length > 0) {
      // Just render standalone stops
      stops.forEach((s) => {
        const stopIcon = L.divIcon({
          className: "custom-stop-marker",
          html: `<div class="stop-marker-pin"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });
        const m = L.marker([s.latitude, s.longitude], { icon: stopIcon });
        m.bindPopup(`
          <div style="font-family: system-ui; padding: 4px;">
            <div style="font-weight: 700; font-size: 13px;">${s.name}</div>
            <div style="font-size: 11px; color: #64748b;">${s.code}</div>
          </div>
        `);
        m.addTo(routeLayerRef.current);
      });
    }
  }, [mapLoaded, route, stops]);

  // Update Bus Markers and User Location
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !markersGroupRef.current) return;

    const L = (window as any).L || (require("leaflet") as any);
    if (!L) return;

    markersGroupRef.current.clearLayers();

    // User location marker
    if (userLocation) {
      const userIcon = L.divIcon({
        className: "custom-user-marker",
        html: `
          <div style="
            width: 18px;
            height: 18px;
            background: #2563eb;
            border: 3px solid #ffffff;
            border-radius: 50%;
            box-shadow: 0 0 0 6px rgba(37, 99, 235, 0.25);
          "></div>
        `,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });
      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .bindPopup("<b>Your Current Location</b>")
        .addTo(markersGroupRef.current);
    }

    // Bus Markers
    buses.forEach((bus) => {
      if (!bus.currentLocation) return;

      const isSelected = bus.id === selectedBusId;
      const isDelayed = bus.status === "DELAYED";
      const heading = bus.currentLocation.heading || 0;

      const busIcon = L.divIcon({
        className: "custom-bus-marker",
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            ${isSelected ? '<div class="pulse-ring"></div>' : ""}
            <div class="bus-marker-pin ${isDelayed ? "bus-marker-delayed" : ""}" style="
              border-color: ${isSelected ? "#ff6b00" : "#ffffff"};
              transform: scale(${isSelected ? "1.15" : "1"});
            ">
              <div class="bus-heading-indicator" style="transform: rotate(${heading}deg); transform-origin: 50% 28px;"></div>
              <span>${bus.busNumber}</span>
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });

      const marker = L.marker([bus.currentLocation.latitude, bus.currentLocation.longitude], {
        icon: busIcon,
        zIndexOffset: isSelected ? 1000 : 100,
      });

      const popupHtml = `
        <div style="font-family: system-ui; min-width: 180px; padding: 4px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">
            <span style="font-weight: 800; font-size: 14px; color: #0f172a;">🚌 Bus ${bus.busNumber}</span>
            <span style="font-size: 10px; font-weight: 700; background: ${isDelayed ? "#fef3c7" : "#dcfce7"}; color: ${isDelayed ? "#92400e" : "#166534"}; padding: 2px 6px; border-radius: 999px;">
              ${bus.status}
            </span>
          </div>

          <div style="font-size: 11px; color: #64748b; margin-top: 6px;">
            Route: <b>${bus.route?.routeName || "Telangana Express"}</b>
          </div>

          <div style="background: #f1f5f9; padding: 6px 8px; border-radius: 6px; margin-top: 6px; font-size: 11px;">
            <div>Next Stop: <b style="color: #0f766e;">${bus.currentLocation.nextStopName || "Next Transit Stop"}</b></div>
            <div style="margin-top: 2px;">Live ETA: <b style="color: #0f766e; font-size: 12px;">${formatEta(bus.currentLocation.etaToNextMin)}</b></div>
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 6px; font-size: 10px; color: #64748b;">
            <span>Speed: <b>${Math.round(bus.currentLocation.speed)} km/h</b></span>
            <span>Occupancy: <b>${bus.currentOccupancy?.occupancyPercentage ?? 60}%</b></span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on("click", () => {
        if (onSelectBus) {
          onSelectBus(bus);
        }
      });

      marker.addTo(markersGroupRef.current);

      if (isSelected && mapInstanceRef.current) {
        mapInstanceRef.current.panTo([bus.currentLocation.latitude, bus.currentLocation.longitude], {
          animate: true,
          duration: 0.8,
        });
      }
    });
  }, [mapLoaded, buses, selectedBusId, userLocation, onSelectBus]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
      <div ref={mapContainerRef} style={{ height, width: "100%" }} />

      {/* Floating Map Controls & Overlays */}
      <div className="absolute top-3 left-3 z-[400] flex flex-col gap-2">
        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-md text-xs font-semibold text-slate-800 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Live Tracking active ({buses.filter((b) => b.status === "ACTIVE").length} Buses)</span>
        </div>
      </div>

      <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-md text-[11px] text-slate-500 flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-700" />
          <span>Active Bus</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
          <span>Delayed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-600" />
          <span>RTC Stop</span>
        </div>
      </div>
    </div>
  );
};
