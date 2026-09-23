const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Telangana Smart RTC Database Seed...");

  // 1. Clean existing records
  try {
    await prisma.auditLog.deleteMany();
    await prisma.report.deleteMany();
    await prisma.favorite.deleteMany();
    await prisma.trafficStatus.deleteMany();
    await prisma.busOccupancy.deleteMany();
    await prisma.busLocation.deleteMany();
    await prisma.routeStop.deleteMany();
    await prisma.bus.deleteMany();
    await prisma.route.deleteMany();
    await prisma.busStop.deleteMany();
    await prisma.user.deleteMany();
  } catch (e) {
    console.log("Database table cleanup skipped or first-time setup");
  }

  // 2. Users
  const adminPasswordHash = await bcrypt.hash("Admin@RTC2026!", 10);
  const passengerPasswordHash = await bcrypt.hash("Passenger@2026!", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@smartrtc.in",
      name: "TSRTC Fleet Administrator",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  const passenger = await prisma.user.create({
    data: {
      email: "passenger@smartrtc.in",
      name: "Telangana Commuter",
      passwordHash: passengerPasswordHash,
      role: "PASSENGER",
    },
  });

  console.log(`✅ Seeded users: Admin (${admin.email}), Passenger (${passenger.email})`);

  // 3. Stops
  const stopsData = [
    { id: "stop-koti", name: "Koti Bus Station", code: "HYD-KOTI-01", latitude: 17.3828, longitude: 78.4842, landmark: "Women's College", city: "Hyderabad" },
    { id: "stop-abids", name: "Abids GPO", code: "HYD-ABID-02", latitude: 17.3892, longitude: 78.4754, landmark: "General Post Office", city: "Hyderabad" },
    { id: "stop-nampally", name: "Nampally Station", code: "HYD-NAMP-03", latitude: 17.3921, longitude: 78.4682, landmark: "Railway Station", city: "Hyderabad" },
    { id: "stop-lakdikapul", name: "Lakdikapul", code: "HYD-LAKD-04", latitude: 17.4042, longitude: 78.4633, landmark: "Global Hospital", city: "Hyderabad" },
    { id: "stop-khairatabad", name: "Khairatabad", code: "HYD-KHAIR-05", latitude: 17.4125, longitude: 78.4589, landmark: "Khairatabad Flyover", city: "Hyderabad" },
    { id: "stop-panjagutta", name: "Panjagutta", code: "HYD-PANJ-06", latitude: 17.4258, longitude: 78.4514, landmark: "Central Mall", city: "Hyderabad" },
    { id: "stop-ameerpet", name: "Ameerpet Metro", code: "HYD-AMRP-07", latitude: 17.4374, longitude: 78.4482, landmark: "Metro Interchange", city: "Hyderabad" },
    { id: "stop-srnagar", name: "SR Nagar", code: "HYD-SRNG-08", latitude: 17.4436, longitude: 78.4438, landmark: "Umesh Chandra Statue", city: "Hyderabad" },
    { id: "stop-kukatpally", name: "Kukatpally", code: "HYD-KUKT-11", latitude: 17.4849, longitude: 78.4138, landmark: "Bus Depot", city: "Hyderabad" },
    { id: "stop-kphb", name: "KPHB Colony", code: "HYD-KPHB-12", latitude: 17.4932, longitude: 78.4017, landmark: "Forum Sujana Mall", city: "Hyderabad" },
    { id: "stop-jntu", name: "JNTU Hyderabad", code: "HYD-JNTU-13", latitude: 17.4985, longitude: 78.3912, landmark: "Main Gate", city: "Hyderabad" },
    { id: "stop-miyapur", name: "Miyapur Metro", code: "HYD-MIYA-14", latitude: 17.5142, longitude: 78.3698, landmark: "Depot", city: "Hyderabad" },
    { id: "stop-patancheru", name: "Patancheru Bus Station", code: "HYD-PATN-17", latitude: 17.5312, longitude: 78.2641, landmark: "RTC Depot", city: "Hyderabad" },
    { id: "stop-secunderabad", name: "Secunderabad Station", code: "HYD-SC-01", latitude: 17.4339, longitude: 78.5015, landmark: "Junction", city: "Secunderabad" },
    { id: "stop-paradise", name: "Paradise", code: "HYD-PAR-02", latitude: 17.4416, longitude: 78.4878, landmark: "Circle", city: "Secunderabad" },
    { id: "stop-ranigunj", name: "Ranigunj", code: "HYD-RANI-03", latitude: 17.4285, longitude: 78.4891, landmark: "Depot 1", city: "Secunderabad" },
    { id: "stop-tankbund", name: "Tank Bund", code: "HYD-TANK-04", latitude: 17.4239, longitude: 78.4738, landmark: "Buddha Statue", city: "Hyderabad" },
    { id: "stop-charminar", name: "Charminar", code: "HYD-CHAR-08", latitude: 17.3616, longitude: 78.4747, landmark: "Monument", city: "Hyderabad" },
    { id: "stop-cybertowers", name: "Cyber Towers (Hitec City)", code: "HYD-CYBR-04", latitude: 17.4504, longitude: 78.3809, landmark: "Junction", city: "Hyderabad" },
    { id: "stop-kondapur", name: "Kondapur Bus Stand", code: "HYD-KOND-05", latitude: 17.4681, longitude: 78.3612, landmark: "RTA Office", city: "Hyderabad" },
  ];

  for (const stop of stopsData) {
    await prisma.busStop.create({ data: stop });
  }
  console.log(`✅ Seeded ${stopsData.length} bus stops`);

  // 4. Routes
  const route218 = await prisma.route.create({
    data: {
      id: "route-218",
      routeNumber: "218",
      routeName: "Koti Bus Station to Patancheru",
      startPoint: "Koti Bus Station",
      destination: "Patancheru Bus Station",
      totalDistanceKm: 36.5,
      estimatedDurationMin: 75,
      isActive: true,
      trafficStatuses: {
        create: {
          condition: "MODERATE",
          delayMinutes: 4,
          description: "Moderate traffic along Ameerpet and Miyapur corridor.",
        },
      },
    },
  });

  const route25A = await prisma.route.create({
    data: {
      id: "route-25a",
      routeNumber: "25A",
      routeName: "Secunderabad Station to Charminar",
      startPoint: "Secunderabad Station",
      destination: "Charminar",
      totalDistanceKm: 14.8,
      estimatedDurationMin: 40,
      isActive: true,
      trafficStatuses: {
        create: {
          condition: "LOW",
          delayMinutes: 0,
          description: "Clear traffic flow along Tank Bund and Old City.",
        },
      },
    },
  });

  console.log("✅ Seeded routes (218, 25A)");

  // 5. Buses
  await prisma.bus.create({
    data: {
      id: "bus-218a",
      busNumber: "218",
      registrationNumber: "TS 09 Z 4812",
      capacity: 60,
      status: "ACTIVE",
      isSimulated: true,
      routeId: route218.id,
      locations: {
        create: {
          latitude: 17.4374,
          longitude: 78.4482,
          speed: 32,
          heading: 295,
          distanceToNextKm: 1.5,
          etaToNextMin: 5,
        },
      },
      occupancies: {
        create: {
          totalCapacity: 60,
          occupiedSeats: 42,
          availableSeats: 18,
          occupancyPercentage: 70,
          status: "MODERATE",
        },
      },
    },
  });

  await prisma.bus.create({
    data: {
      id: "bus-25a",
      busNumber: "25A",
      registrationNumber: "TS 09 Z 2501",
      capacity: 60,
      status: "ACTIVE",
      isSimulated: true,
      routeId: route25A.id,
      locations: {
        create: {
          latitude: 17.4416,
          longitude: 78.4878,
          speed: 28,
          heading: 185,
          distanceToNextKm: 1.9,
          etaToNextMin: 6,
        },
      },
      occupancies: {
        create: {
          totalCapacity: 60,
          occupiedSeats: 22,
          availableSeats: 38,
          occupancyPercentage: 36,
          status: "LOW",
        },
      },
    },
  });

  console.log("✅ Seeded buses (218, 25A) with locations and occupancy");
  console.log("🎉 Database seeding complete!");
}

main()
  .catch((e) => {
    console.error("Seed error (note: if PostgreSQL is not running locally, the application automatically uses high-fidelity in-memory fallback):", e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
