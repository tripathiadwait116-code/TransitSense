export type Role = 'ADMIN' | 'PASSENGER';

export type BusStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'DELAYED';

export type OccupancyStatus = 'LOW' | 'MODERATE' | 'HIGH' | 'FULL';

export type TrafficCondition = 'LOW' | 'MODERATE' | 'HEAVY';

export type ReportCategory =
  | 'BUS_DELAY'
  | 'OVERCROWDING'
  | 'BUS_NOT_FOUND'
  | 'INCORRECT_ETA'
  | 'STOP_ISSUE'
  | 'OTHER';

export type ReportStatus = 'PENDING' | 'IN_REVIEW' | 'RESOLVED';

export type FavoriteTargetType = 'BUS' | 'ROUTE' | 'STOP';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface BusStopDTO {
  id: string;
  name: string;
  code: string;
  latitude: number;
  longitude: number;
  landmark?: string | null;
  city: string;
  distanceMeters?: number;
}

export interface RouteStopDTO {
  id: string;
  routeId: string;
  stopId: string;
  stopSequence: number;
  distanceToNextKm: number;
  estimatedTravelTimeToNextMin: number;
  stop: BusStopDTO;
}

export interface RouteDTO {
  id: string;
  routeNumber: string;
  routeName: string;
  startPoint: string;
  destination: string;
  totalDistanceKm: number;
  estimatedDurationMin: number;
  isActive: boolean;
  routeStops?: RouteStopDTO[];
  trafficCondition?: TrafficCondition;
  delayMinutes?: number;
  activeBusesCount?: number;
}

export interface BusLocationDTO {
  id: string;
  busId: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  nextStopId?: string | null;
  nextStopName?: string | null;
  distanceToNextKm: number;
  etaToNextMin: number;
  timestamp: string;
}

export interface BusOccupancyDTO {
  id: string;
  busId: string;
  totalCapacity: number;
  occupiedSeats: number;
  availableSeats: number;
  occupancyPercentage: number;
  status: OccupancyStatus;
  timestamp: string;
}

export interface BusDTO {
  id: string;
  busNumber: string;
  registrationNumber: string;
  capacity: number;
  status: BusStatus;
  isSimulated: boolean;
  routeId?: string | null;
  route?: RouteDTO | null;
  currentLocation?: BusLocationDTO | null;
  currentOccupancy?: BusOccupancyDTO | null;
  currentTraffic?: {
    condition: TrafficCondition;
    delayMinutes: number;
    description?: string | null;
  } | null;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
