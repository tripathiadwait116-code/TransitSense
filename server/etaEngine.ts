import { TrafficCondition } from "@/types";

export interface EtaCalculationParams {
  distanceKm: number;
  currentSpeedKmh: number;
  trafficCondition: TrafficCondition;
  trafficDelayMinutes?: number;
  remainingStopsCount?: number;
  averageDwellTimeSecondsPerStop?: number; // default ~45s per stop
}

export interface EtaCalculationResult {
  estimatedMinutes: number;
  trafficDelayMinutes: number;
  baseTravelMinutes: number;
  dwellMinutes: number;
  isSimulated: boolean;
  confidence: "HIGH" | "MEDIUM" | "LOW";
}

/**
 * Enterprise-grade ETA engine for public transit.
 * Can be configured with real telemetry or simulation data.
 */
export function calculateETA(params: EtaCalculationParams): EtaCalculationResult {
  const {
    distanceKm,
    currentSpeedKmh,
    trafficCondition,
    remainingStopsCount = 1,
    averageDwellTimeSecondsPerStop = 45,
  } = params;

  // Protect against division by zero or unrealistic speeds
  const effectiveSpeed = Math.max(12, Math.min(65, currentSpeedKmh > 0 ? currentSpeedKmh : 24));

  // Base travel time in minutes based on distance and speed
  const baseTravelMinutes = Math.round((distanceKm / effectiveSpeed) * 60);

  // Traffic delay adjustment
  let trafficDelayMinutes = params.trafficDelayMinutes ?? 0;
  if (params.trafficDelayMinutes === undefined) {
    switch (trafficCondition) {
      case "LOW":
        trafficDelayMinutes = 0;
        break;
      case "MODERATE":
        trafficDelayMinutes = Math.max(2, Math.round(distanceKm * 0.8));
        break;
      case "HEAVY":
        trafficDelayMinutes = Math.max(6, Math.round(distanceKm * 2.2));
        break;
    }
  }

  // Dwell time for passengers boarding/alighting at intermediate stops
  const dwellMinutes = Math.round(
    (Math.max(0, remainingStopsCount - 1) * averageDwellTimeSecondsPerStop) / 60
  );

  const totalMinutes = Math.max(1, baseTravelMinutes + trafficDelayMinutes + dwellMinutes);

  return {
    estimatedMinutes: totalMinutes,
    trafficDelayMinutes,
    baseTravelMinutes,
    dwellMinutes,
    isSimulated: true,
    confidence: trafficCondition === "HEAVY" ? "MEDIUM" : "HIGH",
  };
}
