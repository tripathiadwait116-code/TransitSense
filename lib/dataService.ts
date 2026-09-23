import { prisma } from "./prisma";
import { simulationEngine } from "@/server/simulationEngine";
import { SEED_ROUTES, SEED_STOPS } from "@/server/seedData";
import { BusDTO, RouteDTO, BusStopDTO, Role, ReportCategory, ReportStatus, FavoriteTargetType } from "@/types";
import { calculateDistance } from "./utils";
import bcrypt from "bcryptjs";

// In-memory persistent storage for serverless runtime fallback
interface MemoryStore {
  users: Array<{
    id: string;
    email: string;
    name: string;
    passwordHash: string;
    role: Role;
  }>;
  routes: RouteDTO[];
  stops: BusStopDTO[];
  reports: Array<{
    id: string;
    userId?: string | null;
    category: ReportCategory;
    busNumber?: string | null;
    routeId?: string | null;
    description: string;
    status: ReportStatus;
    contactEmail?: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
  favorites: Array<{
    id: string;
    userId: string;
    targetType: FavoriteTargetType;
    targetId: string;
    createdAt: string;
  }>;
}

declare global {
  // eslint-disable-next-line no-var
  var memoryStoreInstance: MemoryStore | undefined;
}

function initMemoryStore(): MemoryStore {
  const adminHash = bcrypt.hashSync("Admin@RTC2026!", 10);
  const passengerHash = bcrypt.hashSync("Passenger@2026!", 10);

  const stops: BusStopDTO[] = SEED_STOPS.map((s) => ({
    id: s.id,
    name: s.name,
    code: s.code,
    latitude: s.latitude,
    longitude: s.longitude,
    landmark: s.landmark,
    city: s.city,
  }));

  const routes: RouteDTO[] = SEED_ROUTES.map((r) => ({
    id: r.id,
    routeNumber: r.routeNumber,
    routeName: r.routeName,
    startPoint: r.startPoint,
    destination: r.destination,
    totalDistanceKm: r.totalDistanceKm,
    estimatedDurationMin: r.estimatedDurationMin,
    isActive: true,
    trafficCondition: r.trafficCondition,
    delayMinutes: r.delayMinutes,
    routeStops: r.stops.map((rs) => {
      const stop = stops.find((s) => s.id === rs.stopId)!;
      return {
        id: `rs-${r.id}-${rs.stopId}`,
        routeId: r.id,
        stopId: rs.stopId,
        stopSequence: rs.stopSequence,
        distanceToNextKm: rs.distanceToNextKm,
        estimatedTravelTimeToNextMin: rs.estimatedTravelTimeToNextMin,
        stop,
      };
    }),
  }));

  const initialReports = [
    {
      id: "rep-101",
      userId: null,
      category: "BUS_DELAY" as ReportCategory,
      busNumber: "10H",
      routeId: "route-10h",
      description: "Bus delayed over 15 mins due to Jubilee Hills junction traffic bottleneck.",
      status: "IN_REVIEW" as ReportStatus,
      contactEmail: "passenger1@example.com",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "rep-102",
      userId: null,
      category: "OVERCROWDING" as ReportCategory,
      busNumber: "218",
      routeId: "route-218",
      description: "Severe overcrowding during peak morning hours between Ameerpet and Kukatpally.",
      status: "PENDING" as ReportStatus,
      contactEmail: "commuter@hyd.in",
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  return {
    users: [
      {
        id: "usr-admin-1",
        email: "admin@smartrtc.in",
        name: "TSRTC Fleet Administrator",
        passwordHash: adminHash,
        role: "ADMIN",
      },
      {
        id: "usr-passenger-1",
        email: "passenger@smartrtc.in",
        name: "Telangana Commuter",
        passwordHash: passengerHash,
        role: "PASSENGER",
      },
    ],
    routes,
    stops,
    reports: initialReports,
    favorites: [
      {
        id: "fav-1",
        userId: "usr-passenger-1",
        targetType: "BUS",
        targetId: "bus-218a",
        createdAt: new Date().toISOString(),
      },
    ],
  };
}

const memoryStore = global.memoryStoreInstance || initMemoryStore();
if (process.env.NODE_ENV !== "production") {
  global.memoryStoreInstance = memoryStore;
}

export const dataService = {
  // --- USERS ---
  async findUserByEmail(email: string) {
    try {
      const dbUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
      if (dbUser) return dbUser;
    } catch {
      // Prisma offline, fallback
    }
    return memoryStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async createUser(data: { email: string; name: string; passwordHash: string; role?: Role }) {
    const role = data.role || "PASSENGER";
    try {
      const dbUser = await prisma.user.create({
        data: {
          email: data.email.toLowerCase(),
          name: data.name,
          passwordHash: data.passwordHash,
          role,
        },
      });
      return dbUser;
    } catch {
      // Fallback
    }
    const newUser = {
      id: `usr-${Date.now()}`,
      email: data.email.toLowerCase(),
      name: data.name,
      passwordHash: data.passwordHash,
      role,
    };
    memoryStore.users.push(newUser);
    return newUser;
  },

  // --- BUSES ---
  async getBuses(filters?: { search?: string; routeId?: string; status?: string }): Promise<BusDTO[]> {
    let buses = simulationEngine.getAllSimulatedBuses();

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      buses = buses.filter(
        (b) =>
          b.busNumber.toLowerCase().includes(q) ||
          b.registrationNumber.toLowerCase().includes(q) ||
          b.route?.routeName.toLowerCase().includes(q) ||
          b.route?.routeNumber.toLowerCase().includes(q)
      );
    }

    if (filters?.routeId) {
      buses = buses.filter((b) => b.routeId === filters.routeId);
    }

    if (filters?.status) {
      buses = buses.filter((b) => b.status === filters.status);
    }

    return buses;
  },

  async getBusById(id: string): Promise<BusDTO | null> {
    return simulationEngine.getBusById(id);
  },

  async updateBusStatus(id: string, status: any): Promise<boolean> {
    const ok = simulationEngine.updateBusStatus(id, status);
    try {
      await prisma.bus.update({ where: { id }, data: { status } });
    } catch {}
    return ok;
  },

  async updateBusLocation(id: string, lat: number, lng: number, speed?: number, heading?: number): Promise<boolean> {
    const ok = simulationEngine.updateBusLocation(id, lat, lng, speed, heading);
    try {
      await prisma.busLocation.create({
        data: {
          busId: id,
          latitude: lat,
          longitude: lng,
          speed: speed || 0,
          heading: heading || 0,
        },
      });
    } catch {}
    return ok;
  },

  // --- ROUTES ---
  async getRoutes(): Promise<RouteDTO[]> {
    const activeBuses = simulationEngine.getAllSimulatedBuses();

    return memoryStore.routes.map((r) => {
      const busCount = activeBuses.filter((b) => b.routeId === r.id && b.status === "ACTIVE").length;
      return {
        ...r,
        activeBusesCount: busCount,
      };
    });
  },

  async getRouteById(id: string): Promise<RouteDTO | null> {
    const route = memoryStore.routes.find((r) => r.id === id || r.routeNumber === id);
    if (!route) return null;

    const activeBuses = simulationEngine
      .getAllSimulatedBuses()
      .filter((b) => b.routeId === route.id && b.status === "ACTIVE");

    return {
      ...route,
      activeBusesCount: activeBuses.length,
    };
  },

  // --- STOPS ---
  async getStops(options?: { search?: string; lat?: number; lng?: number; radiusKm?: number }): Promise<BusStopDTO[]> {
    let stops = [...memoryStore.stops];

    if (options?.search) {
      const q = options.search.toLowerCase();
      stops = stops.filter(
        (s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.landmark?.toLowerCase().includes(q)
      );
    }

    if (options?.lat !== undefined && options?.lng !== undefined) {
      stops = stops.map((s) => {
        const distKm = calculateDistance(options.lat!, options.lng!, s.latitude, s.longitude);
        return {
          ...s,
          distanceMeters: Math.round(distKm * 1000),
        };
      });

      // Sort by proximity
      stops.sort((a, b) => (a.distanceMeters || 0) - (b.distanceMeters || 0));

      if (options.radiusKm) {
        stops = stops.filter((s) => (s.distanceMeters || 0) <= options.radiusKm! * 1000);
      }
    }

    return stops;
  },

  async getStopById(id: string): Promise<{ stop: BusStopDTO; incomingBuses: any[] } | null> {
    const stop = memoryStore.stops.find((s) => s.id === id || s.code === id);
    if (!stop) return null;

    // Find incoming buses whose route includes this stop and bus hasn't passed it yet
    const allBuses = simulationEngine.getAllSimulatedBuses();
    const incoming: any[] = [];

    for (const bus of allBuses) {
      if (!bus.routeId || bus.status !== "ACTIVE") continue;
      const route = memoryStore.routes.find((r) => r.id === bus.routeId);
      if (!route || !route.routeStops) continue;

      const stopSeqItem = route.routeStops.find((rs) => rs.stopId === stop.id);
      if (!stopSeqItem) continue;

      // Distance from bus current location to this stop
      if (bus.currentLocation) {
        const distKm = calculateDistance(
          bus.currentLocation.latitude,
          bus.currentLocation.longitude,
          stop.latitude,
          stop.longitude
        );

        // Approximate ETA
        const speed = Math.max(15, bus.currentLocation.speed || 25);
        const etaMins = Math.max(1, Math.round((distKm / speed) * 60));

        incoming.push({
          busId: bus.id,
          busNumber: bus.busNumber,
          routeNumber: route.routeNumber,
          routeName: route.routeName,
          destination: route.destination,
          distanceKm: distKm,
          etaMinutes: etaMins,
          occupancy: bus.currentOccupancy,
          trafficCondition: route.trafficCondition,
        });
      }
    }

    incoming.sort((a, b) => a.etaMinutes - b.etaMinutes);

    return {
      stop,
      incomingBuses: incoming,
    };
  },

  // --- REPORTS ---
  async getReports() {
    return memoryStore.reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async createReport(data: {
    userId?: string | null;
    category: ReportCategory;
    busNumber?: string | null;
    routeId?: string | null;
    description: string;
    contactEmail?: string | null;
  }) {
    const newReport = {
      id: `rep-${Date.now()}`,
      userId: data.userId || null,
      category: data.category,
      busNumber: data.busNumber || null,
      routeId: data.routeId || null,
      description: data.description,
      status: "PENDING" as ReportStatus,
      contactEmail: data.contactEmail || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryStore.reports.unshift(newReport);
    return newReport;
  },

  async updateReportStatus(id: string, status: ReportStatus) {
    const report = memoryStore.reports.find((r) => r.id === id);
    if (!report) return null;
    report.status = status;
    report.updatedAt = new Date().toISOString();
    return report;
  },

  // --- FAVORITES ---
  async getFavorites(userId: string) {
    return memoryStore.favorites.filter((f) => f.userId === userId);
  },

  async addFavorite(userId: string, targetType: FavoriteTargetType, targetId: string) {
    const existing = memoryStore.favorites.find(
      (f) => f.userId === userId && f.targetType === targetType && f.targetId === targetId
    );
    if (existing) return existing;

    const fav = {
      id: `fav-${Date.now()}`,
      userId,
      targetType,
      targetId,
      createdAt: new Date().toISOString(),
    };
    memoryStore.favorites.push(fav);
    return fav;
  },

  async removeFavorite(userId: string, targetType: FavoriteTargetType, targetId: string) {
    const initialLen = memoryStore.favorites.length;
    memoryStore.favorites = memoryStore.favorites.filter(
      (f) => !(f.userId === userId && f.targetType === targetType && f.targetId === targetId)
    );
    return memoryStore.favorites.length < initialLen;
  },

  // --- ADMIN STATS ---
  async getAdminStats() {
    const buses = simulationEngine.getAllSimulatedBuses();
    const activeBuses = buses.filter((b) => b.status === "ACTIVE").length;
    const delayedBuses = buses.filter((b) => b.status === "DELAYED").length;
    const offlineBuses = buses.filter((b) => b.status === "INACTIVE" || b.status === "MAINTENANCE").length;

    const routesCount = memoryStore.routes.length;
    const stopsCount = memoryStore.stops.length;
    const pendingReports = memoryStore.reports.filter((r) => r.status === "PENDING").length;

    return {
      totalBuses: buses.length,
      activeBuses,
      delayedBuses,
      offlineBuses,
      totalRoutes: routesCount,
      totalStops: stopsCount,
      activeUsersCount: memoryStore.users.length,
      pendingReportsCount: pendingReports,
      totalReportsCount: memoryStore.reports.length,
      fleetOccupancyAverage: Math.round(
        buses.reduce((acc, b) => acc + (b.currentOccupancy?.occupancyPercentage || 0), 0) / (buses.length || 1)
      ),
    };
  },
};
