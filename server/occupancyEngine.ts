import { OccupancyStatus } from "@/types";

export interface OccupancyResult {
  totalCapacity: number;
  occupiedSeats: number;
  availableSeats: number;
  occupancyPercentage: number;
  status: OccupancyStatus;
  statusLabel: string;
  isSimulated: boolean;
}

export function classifyOccupancy(
  totalCapacity: number,
  occupiedSeats: number
): OccupancyResult {
  const safeCapacity = Math.max(1, totalCapacity);
  const safeOccupied = Math.max(0, Math.min(safeCapacity, occupiedSeats));
  const available = Math.max(0, safeCapacity - safeOccupied);
  const percentage = Math.round((safeOccupied / safeCapacity) * 100);

  let status: OccupancyStatus = "LOW";
  let statusLabel = "Many Seats Available";

  if (percentage >= 95) {
    status = "FULL";
    statusLabel = "Bus Full / Standing Only";
  } else if (percentage >= 75) {
    status = "HIGH";
    statusLabel = "Crowded";
  } else if (percentage >= 40) {
    status = "MODERATE";
    statusLabel = "Moderate Seats";
  }

  return {
    totalCapacity: safeCapacity,
    occupiedSeats: safeOccupied,
    availableSeats: available,
    occupancyPercentage: percentage,
    status,
    statusLabel,
    isSimulated: true,
  };
}

/**
 * Simulates boarding and alighting of passengers at stops
 */
export function simulatePassengerTurnover(
  currentOccupied: number,
  capacity: number
): number {
  // Random fluctuation: +/- 2 to 6 passengers at a stop
  const delta = Math.floor(Math.random() * 9) - 4; // -4 to +4
  const updated = Math.max(5, Math.min(capacity - 2, currentOccupied + delta));
  return updated;
}
