import { SEED_BUSES, SEED_ROUTES, SEED_STOPS, SeedBus, SeedRoute } from "./seedData";
import { calculateBearing, calculateDistance } from "@/lib/utils";
import { calculateETA } from "./etaEngine";
import { classifyOccupancy, simulatePassengerTurnover } from "./occupancyEngine";
import { assessTrafficCondition } from "./trafficEngine";
import { BusDTO, BusLocationDTO, BusOccupancyDTO, TrafficCondition } from "@/types";

interface SimulatedBusRuntime extends SeedBus {
  latitude: number;
  longitude: number;
  heading: number;
  nextStopId: string;
  nextStopName: string;
  distanceToNextKm: number;
  etaToNextMin: number;
  lastUpdated: string;
}

class SimulationEngine {
  private buses: Map<string, SimulatedBusRuntime> = new Map();
  private routes: Map<string, SeedRoute> = new Map();
  private stops: Map<string, (typeof SEED_STOPS)[0]> = new Map();
  private isInitialized = false;

  constructor() {
    this.init();
  }

  public init() {
    if (this.isInitialized) return;

    // Index stops
    for (const stop of SEED_STOPS) {
      this.stops.set(stop.id, stop);
    }

    // Index routes
    for (const route of SEED_ROUTES) {
      this.routes.set(route.id, route);
    }

    // Initialize buses with starting coordinates
    for (const seedBus of SEED_BUSES) {
      const route = this.routes.get(seedBus.routeId);
      if (!route || route.stops.length < 2) continue;

      const stopIdx = Math.min(seedBus.currentStopIndex, route.stops.length - 2);
      const currStopId = route.stops[stopIdx].stopId;
      const nextStopId = route.stops[stopIdx + 1].stopId;

      const currStop = this.stops.get(currStopId);
      const nextStop = this.stops.get(nextStopId);

      if (!currStop || !nextStop) continue;

      const t = seedBus.progressBetweenStops;
      const lat = currStop.latitude + (nextStop.latitude - currStop.latitude) * t;
      const lng = currStop.longitude + (nextStop.longitude - currStop.longitude) * t;
      const heading = calculateBearing(currStop.latitude, currStop.longitude, nextStop.latitude, nextStop.longitude);
      const distanceToNext = calculateDistance(lat, lng, nextStop.latitude, nextStop.longitude);

      const eta = calculateETA({
        distanceKm: distanceToNext,
        currentSpeedKmh: seedBus.speed,
        trafficCondition: route.trafficCondition as TrafficCondition,
      });

      this.buses.set(seedBus.id, {
        ...seedBus,
        latitude: lat,
        longitude: lng,
        heading,
        nextStopId: nextStop.id,
        nextStopName: nextStop.name,
        distanceToNextKm: distanceToNext,
        etaToNextMin: eta.estimatedMinutes,
        lastUpdated: new Date().toISOString(),
      });
    }

    this.isInitialized = true;
  }

  /**
   * Advances simulation by a step (called periodically or on telemetry tick)
   */
  public stepSimulation(deltaSeconds = 5) {
    this.init();

    for (const [busId, bus] of Array.from(this.buses.entries())) {
      if (bus.status !== "ACTIVE" && bus.status !== "DELAYED") continue;

      const route = this.routes.get(bus.routeId);
      if (!route) continue;

      const traffic = assessTrafficCondition(route.trafficCondition as TrafficCondition, route.routeName);

      // Adjust speed with small realistic random jitter and traffic multiplier
      const baseSpeed = bus.status === "DELAYED" ? 18 : 34;
      const speedJitter = (Math.random() - 0.5) * 6; // +/- 3 km/h
      const effectiveSpeed = Math.max(10, Math.min(55, Math.round((baseSpeed + speedJitter) * traffic.speedMultiplier)));
      bus.speed = effectiveSpeed;

      // Distance moved in this step: (km/h) * (seconds / 3600)
      const distanceMovedKm = (effectiveSpeed * deltaSeconds) / 3600;

      const currentStopSequence = bus.currentStopIndex;
      const currentStopInfo = route.stops[currentStopSequence];
      const nextStopInfo = route.stops[currentStopSequence + 1];

      if (!currentStopInfo || !nextStopInfo) {
        // Bus reached end of route - turnaround to start
        bus.currentStopIndex = 0;
        bus.progressBetweenStops = 0;
        continue;
      }

      const segmentLengthKm = Math.max(0.5, currentStopInfo.distanceToNextKm);
      const progressDelta = distanceMovedKm / segmentLengthKm;
      bus.progressBetweenStops += progressDelta;

      const fromStop = this.stops.get(currentStopInfo.stopId);
      const toStop = this.stops.get(nextStopInfo.stopId);

      if (!fromStop || !toStop) continue;

      if (bus.progressBetweenStops >= 1.0) {
        // Bus arrived at next stop! Advance to subsequent stop
        bus.currentStopIndex += 1;
        bus.progressBetweenStops = 0;

        // Simulate boarding / alighting passenger fluctuation at the bus stop
        bus.occupiedSeats = simulatePassengerTurnover(bus.occupiedSeats, bus.capacity);

        // Check if terminus reached
        if (bus.currentStopIndex >= route.stops.length - 1) {
          bus.currentStopIndex = 0; // Loop or reverse
        }
      }

      // Interpolate new position
      const t = bus.progressBetweenStops;
      const newLat = fromStop.latitude + (toStop.latitude - fromStop.latitude) * t;
      const newLng = fromStop.longitude + (toStop.longitude - fromStop.longitude) * t;

      bus.latitude = newLat;
      bus.longitude = newLng;
      bus.heading = calculateBearing(fromStop.latitude, fromStop.longitude, toStop.latitude, toStop.longitude);
      bus.nextStopId = toStop.id;
      bus.nextStopName = toStop.name;

      const remainingDistance = calculateDistance(newLat, newLng, toStop.latitude, toStop.longitude);
      bus.distanceToNextKm = remainingDistance;

      const eta = calculateETA({
        distanceKm: remainingDistance,
        currentSpeedKmh: bus.speed,
        trafficCondition: route.trafficCondition as TrafficCondition,
      });

      bus.etaToNextMin = eta.estimatedMinutes;
      bus.lastUpdated = new Date().toISOString();
    }
  }

  public getAllSimulatedBuses(): BusDTO[] {
    this.init();
    const result: BusDTO[] = [];

    for (const bus of Array.from(this.buses.values())) {
      const route = this.routes.get(bus.routeId);
      const occupancy = classifyOccupancy(bus.capacity, bus.occupiedSeats);
      const traffic = route
        ? assessTrafficCondition(route.trafficCondition as TrafficCondition, route.routeName)
        : null;

      const locationDTO: BusLocationDTO = {
        id: `loc-${bus.id}`,
        busId: bus.id,
        latitude: bus.latitude,
        longitude: bus.longitude,
        speed: bus.speed,
        heading: bus.heading,
        nextStopId: bus.nextStopId,
        nextStopName: bus.nextStopName,
        distanceToNextKm: bus.distanceToNextKm,
        etaToNextMin: bus.etaToNextMin,
        timestamp: bus.lastUpdated,
      };

      const occupancyDTO: BusOccupancyDTO = {
        id: `occ-${bus.id}`,
        busId: bus.id,
        totalCapacity: occupancy.totalCapacity,
        occupiedSeats: occupancy.occupiedSeats,
        availableSeats: occupancy.availableSeats,
        occupancyPercentage: occupancy.occupancyPercentage,
        status: occupancy.status,
        timestamp: bus.lastUpdated,
      };

      result.push({
        id: bus.id,
        busNumber: bus.busNumber,
        registrationNumber: bus.registrationNumber,
        capacity: bus.capacity,
        status: bus.status,
        isSimulated: bus.isSimulated,
        routeId: bus.routeId,
        route: route
          ? {
              id: route.id,
              routeNumber: route.routeNumber,
              routeName: route.routeName,
              startPoint: route.startPoint,
              destination: route.destination,
              totalDistanceKm: route.totalDistanceKm,
              estimatedDurationMin: route.estimatedDurationMin,
              isActive: true,
              trafficCondition: route.trafficCondition as TrafficCondition,
              delayMinutes: route.delayMinutes,
            }
          : null,
        currentLocation: locationDTO,
        currentOccupancy: occupancyDTO,
        currentTraffic: traffic
          ? {
              condition: traffic.condition,
              delayMinutes: traffic.delayMinutes,
              description: traffic.description,
            }
          : null,
      });
    }

    return result;
  }

  public getBusById(id: string): BusDTO | null {
    const buses = this.getAllSimulatedBuses();
    return (
      buses.find(
        (b) => b.id.toLowerCase() === id.toLowerCase() || b.busNumber.toLowerCase() === id.toLowerCase()
      ) || null
    );
  }

  public updateBusStatus(busId: string, status: any): boolean {
    const bus = this.buses.get(busId);
    if (!bus) return false;
    bus.status = status;
    return true;
  }

  public updateBusOccupancy(busId: string, occupiedSeats: number): boolean {
    const bus = this.buses.get(busId);
    if (!bus) return false;
    bus.occupiedSeats = Math.max(0, Math.min(bus.capacity, occupiedSeats));
    return true;
  }

  public updateBusLocation(busId: string, lat: number, lng: number, speed?: number, heading?: number): boolean {
    const bus = this.buses.get(busId);
    if (!bus) return false;
    bus.latitude = lat;
    bus.longitude = lng;
    if (speed !== undefined) bus.speed = speed;
    if (heading !== undefined) bus.heading = heading;
    bus.lastUpdated = new Date().toISOString();
    return true;
  }
}

// Singleton simulation instance across Next.js server invocations
declare global {
  // eslint-disable-next-line no-var
  var simulationEngineInstance: SimulationEngine | undefined;
}

export const simulationEngine = global.simulationEngineInstance || new SimulationEngine();

if (process.env.NODE_ENV !== "production") {
  global.simulationEngineInstance = simulationEngine;
}
