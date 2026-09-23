import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { OccupancyStatus, TrafficCondition, BusStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatEta(minutes: number): string {
  if (minutes <= 0) return "Arriving now";
  if (minutes === 1) return "1 min";
  if (minutes < 60) return `${minutes} mins`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

export function formatSpeed(kmh: number): string {
  return `${Math.round(kmh)} km/h`;
}

export function formatTimestamp(dateOrString: Date | string): string {
  const date = typeof dateOrString === 'string' ? new Date(dateOrString) : dateOrString;
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

/**
 * Haversine formula to compute great-circle distance between two GPS coordinates in Kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculate bearing angle from Point A to Point B in degrees (0 - 360)
 */
export function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const y = Math.sin(toRad(lon2 - lon1)) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lon2 - lon1));

  let brng = toDeg(Math.atan2(y, x));
  return (brng + 360) % 360;
}

export function getOccupancyColor(status: OccupancyStatus) {
  switch (status) {
    case 'LOW':
      return { bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', bar: 'bg-emerald-500', label: 'Seats Available' };
    case 'MODERATE':
      return { bg: 'bg-blue-100 text-blue-800 border-blue-300', bar: 'bg-blue-500', label: 'Moderate' };
    case 'HIGH':
      return { bg: 'bg-amber-100 text-amber-800 border-amber-300', bar: 'bg-amber-500', label: 'Crowded' };
    case 'FULL':
      return { bg: 'bg-rose-100 text-rose-800 border-rose-300', bar: 'bg-rose-600', label: 'Standing Only / Full' };
    default:
      return { bg: 'bg-gray-100 text-gray-800 border-gray-300', bar: 'bg-gray-400', label: 'Unknown' };
  }
}

export function getTrafficColor(condition: TrafficCondition) {
  switch (condition) {
    case 'LOW':
      return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Low Traffic', icon: 'check-circle' };
    case 'MODERATE':
      return { bg: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Moderate Traffic', icon: 'alert-triangle' };
    case 'HEAVY':
      return { bg: 'bg-rose-50 text-rose-700 border-rose-200', label: 'Heavy Congestion', icon: 'alert-octagon' };
    default:
      return { bg: 'bg-slate-50 text-slate-700 border-slate-200', label: 'Normal', icon: 'info' };
  }
}

export function getStatusBadgeInfo(status: BusStatus) {
  switch (status) {
    case 'ACTIVE':
      return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', label: 'On Route' };
    case 'DELAYED':
      return { bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500', label: 'Delayed' };
    case 'MAINTENANCE':
      return { bg: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500', label: 'In Depot' };
    case 'INACTIVE':
      return { bg: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400', label: 'Offline' };
    default:
      return { bg: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400', label: status };
  }
}
