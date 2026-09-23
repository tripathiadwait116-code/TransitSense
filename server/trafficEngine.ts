import { TrafficCondition } from "@/types";

export interface TrafficAssessment {
  condition: TrafficCondition;
  delayMinutes: number;
  description: string;
  speedMultiplier: number;
  isSimulated: boolean;
  lastUpdated: string;
}

/**
 * Assesses traffic state on a transit route based on congestion metrics
 */
export function assessTrafficCondition(condition: TrafficCondition, routeName?: string): TrafficAssessment {
  let delayMinutes = 0;
  let description = "Normal traffic flow with minimal corridor delays.";
  let speedMultiplier = 1.0;

  switch (condition) {
    case "LOW":
      delayMinutes = 0;
      description = `Clear traffic conditions along ${routeName || "the corridor"}. Buses running on schedule.`;
      speedMultiplier = 1.0;
      break;
    case "MODERATE":
      delayMinutes = 4;
      description = `Moderate traffic density detected near key junctions. Expected delay ~4 mins.`;
      speedMultiplier = 0.75;
      break;
    case "HEAVY":
      delayMinutes = 12;
      description = `Heavy congestion and bottleneck reported. Anticipate delays of ~12 mins.`;
      speedMultiplier = 0.45;
      break;
  }

  return {
    condition,
    delayMinutes,
    description,
    speedMultiplier,
    isSimulated: true,
    lastUpdated: new Date().toISOString(),
  };
}
