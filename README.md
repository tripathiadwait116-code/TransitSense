<<<<<<< HEAD
# Telangana Smart RTC — Intelligent Public Bus Tracking & Management Platform

> **Notice:** This platform is an educational and engineering prototype demonstrating modern intelligent public transit architecture, real-time telemetry processing, and commuter-centric interface design. It is not an official government service of the Telangana State Road Transport Corporation (TSRTC).

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Ready-336791?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat&logo=vercel)](https://vercel.com/)

---

## 🚌 System Overview

**Telangana Smart RTC** is a production-quality full-stack web application engineered to transform the public bus commuting experience across the Hyderabad and Secunderabad metropolitan area and outer suburban corridors.

The platform provides passengers with accurate real-time bus locations, dynamic ETA countdown arrival predictions, traffic congestion delay monitoring, live seat occupancy indicators, route stops exploration, and nearby bus stop discovery using browser geolocation.

For transit authorities and dispatchers, an administrative command center provides fleet status tracking, operational state management (Active, Inactive, Delayed, Depot Maintenance), route configuration, and passenger grievance resolution.

---

## 🌟 Key Features

### Passenger Experience
1. **Live Interactive Bus Tracking (`/track`)**:
   - Interactive OpenStreetMap/Leaflet map rendering real-time bus markers with bearing indicators.
   - Live telemetry details: speed, compass heading, next stop, distance to stop, and arrival countdown.
   - Auto-simulation stepper allowing live observation of bus transit along Hyderabad corridors.
2. **Dynamic ETA Engine**:
   - Algorithmic ETA calculation factoring in vehicle speed, remaining stops, dwell time, and corridor traffic conditions.
3. **Bus Occupancy Monitoring**:
   - Real-time seat occupancy progress bar with classification: `Seats Available` (<40%), `Moderate` (40-75%), `Crowded` (75-95%), `Standing Only / Full` (≥95%).
4. **Traffic Congestion System**:
   - Real-time corridor traffic state: Low Traffic (Normal), Moderate Delay (+4 mins), Heavy Congestion (+12 mins).
5. **Route Explorer (`/routes` & `/routes/[id]`)**:
   - Comprehensive directory of major Hyderabad corridors (218, 25A, 10H, 221, 290).
   - Interactive route polylines and ordered stop sequence timelines.
6. **Bus Stop Directory & Proximity Finder (`/stops` & `/stops/[id]`)**:
   - GPS-powered "Find Stops Near Me" utilizing HTML5 Geolocation with distance sorting.
   - Live Arrival Board displaying incoming buses, destination, live ETA, and occupancy.
7. **Passenger Grievance Portal (`/report`)**:
   - Submit incident reports on delays, overcrowding, missing buses, or stop maintenance with reference tracking IDs.
8. **Commuter Favorites (`/favorites`)**:
   - Personalized bookmarks for daily buses, routes, and stops.

### Administrative Command Center (`/admin`)
1. **Fleet Analytics Overview**:
   - Fleet metrics: Active buses, delayed buses, offline units, total routes, and pending grievance tickets.
   - Comprehensive live fleet monitoring map covering all operating transponders.
2. **Bus Fleet Management (`/admin/buses`)**:
   - Register new buses with registration numbers, route assignments, and seating capacities.
   - Instant operational status transitions (`ACTIVE`, `DELAYED`, `MAINTENANCE`, `INACTIVE`).
3. **Corridor Route Inspector (`/admin/routes`)**:
   - View route networks, distances, schedules, and active units.
4. **Bus Stop Manager (`/admin/stops`)**:
   - Inspect station landmarks, codes, and exact GPS coordinates.
5. **Grievance Triage Queue (`/admin/reports`)**:
   - Review commuter feedback and update workflow status: `PENDING` ➔ `IN_REVIEW` ➔ `RESOLVED`.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | Server Components, Route Handlers, Server Actions |
| **Language** | TypeScript 5.6 | Strict type-safety across DTOs and API payloads |
| **Styling** | Tailwind CSS & PostCSS | Official public-transport design system with accessible contrast |
| **Maps** | Leaflet & OpenStreetMap | Zero-cost interactive mapping with custom SVG bus markers |
| **Icons** | Lucide React | High-legibility transit, map, and status iconography |
| **Database** | PostgreSQL & Prisma ORM | Comprehensive relational schema with indexes and soft-deletion |
| **Validation** | Zod | Server-side runtime request validation |
| **Authentication** | JWT & BcryptJS | HTTP-only session cookies with Role-Based Access Control (RBAC) |
| **Deployment** | Vercel Serverless | Optimized for serverless edge execution |

---

## 🗄️ Database Schema Summary (Prisma ORM)

The database schema (`prisma/schema.prisma`) includes:

- `User`: Commuters and administrators with secure bcrypt password hashes and roles (`ADMIN`, `PASSENGER`).
- `Bus`: Public transport vehicles with unique bus numbers, registration numbers, capacity, and operational status.
- `Route`: Transit corridors with start points, destinations, total distance, and duration.
- `BusStop`: Physical transit boarding stops with codes, names, landmarks, and GPS coordinates.
- `RouteStop`: Ordered intermediate stops defining route geometry with sequence numbers and distance.
- `BusLocation`: Time-series GPS telemetry logs containing latitude, longitude, speed, heading, and ETA.
- `BusOccupancy`: Capacity tracking records with occupied seats, available seats, and occupancy percentage.
- `TrafficStatus`: Route congestion condition logs with delay minutes and descriptions.
- `Favorite`: Commuter bookmarks linked to buses, routes, or stops.
- `Report`: Passenger grievance submissions with status tracking (`PENDING`, `IN_REVIEW`, `RESOLVED`).
- `AuditLog`: Security and administrative change audit logs.

---

## 🔐 Demo Credentials

Use the following pre-configured credentials to test all role-based features:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Fleet Administrator** | `admin@smartrtc.in` | `Admin@RTC2026!` | Access `/admin` console, fleet CRUD, status toggling, reports triage |
| **Commuter Passenger** | `passenger@smartrtc.in` | `Passenger@2026!` | Access `/favorites`, submit grievances, personal bookmarks |

*(A quick-fill button is also available directly on the login screen for 1-click access.)*

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js LTS (v20+ or v24+)
- npm (v10+)
- PostgreSQL (optional for local DB; the app includes an automatic fallback data service so it runs immediately out of the box)

### Installation
1. Clone the repository and enter the directory:
   ```bash
   cd TransitX
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

4. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```

5. (Optional) Run database migration & seed:
   If connecting to a live PostgreSQL database:
   ```bash
   npx prisma migrate dev --name init
   npm run prisma:seed
   ```

6. Run automated test suite:
   ```bash
   npm test
   ```

7. Start development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 API Reference

### Public Telemetry APIs
- `GET /api/buses`: List active buses (filters: `search`, `routeId`, `status`)
- `GET /api/buses/[id]`: Retrieve single bus telemetry, route, and occupancy
- `GET /api/buses/[id]/location`: Real-time coordinates, speed, and heading
- `POST /api/buses/[id]/location`: Telemetry ingestion endpoint for GPS hardware
- `GET /api/buses/[id]/eta`: Live algorithmic ETA calculation for next stop
- `GET /api/buses/[id]/occupancy`: Seating occupancy breakdown
- `GET /api/routes`: List all transit corridors with active bus counts
- `GET /api/routes/[id]`: Route stops sequence and active buses on corridor
- `GET /api/stops`: List stops (supports `search`, `lat`, `lng` for proximity sorting)
- `GET /api/stops/[id]`: Stop details and incoming bus arrival board
- `GET /api/search?q=...`: Global unified debounced search across buses, routes, and stops
- `GET /api/simulation/tick?delta=5`: Advances simulated bus coordinates along route waypoints

### Commuter & Feedback APIs
- `POST /api/auth/register`: Create new commuter account
- `POST /api/auth/login`: Authenticate and receive HTTP-only session cookie
- `GET /api/auth/me`: Retrieve current user session
- `POST /api/auth/logout`: Invalidate session
- `GET /api/favorites`: List user saved buses and routes
- `POST /api/favorites`: Save bus or route to favorites
- `DELETE /api/favorites`: Remove favorite
- `POST /api/reports`: Submit commuter grievance report
- `GET /api/reports`: List grievance reports

### Administrative APIs (Requires `role === 'ADMIN'`)
- `GET /api/admin/stats`: Fleet status overview, delayed buses, report counts
- `POST /api/admin/buses`: Register new public transit bus
- `PUT /api/admin/buses/[id]`: Update bus operational status or route assignment
- `DELETE /api/admin/buses/[id]`: Deactivate bus
- `PATCH /api/admin/reports/[id]`: Update grievance status (`PENDING` / `IN_REVIEW` / `RESOLVED`)

---

## ☁️ Vercel Deployment Instructions

The application is engineered strictly according to Vercel serverless execution requirements:

1. Push your code to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "feat: Telangana Smart RTC full-stack platform"
   git remote add origin https://github.com/<your-username>/telangana-smart-rtc.git
   git push -u origin main
   ```

2. Import the project into [Vercel](https://vercel.com/new).

3. Set the following Environment Variables in the Vercel Project Settings:
   - `DATABASE_URL`: Your PostgreSQL connection URI (e.g. from Neon, Supabase, or AWS RDS).
   - `AUTH_SECRET`: Random 32+ character string for JWT signing.
   - `NEXT_PUBLIC_APP_URL`: Your deployed Vercel domain (e.g. `https://telangana-smart-rtc.vercel.app`).
   - `NEXT_PUBLIC_MAP_API_KEY`: (Optional) Mapbox key if using custom tiles; otherwise OpenStreetMap is used automatically.

4. Build Command:
   ```bash
   npm run build
   ```
   *(This automatically executes `prisma generate && next build`.)*

---

## 📡 Future AIS-140 Real-GPS Integration Plan

The platform is designed with an isolated telemetry abstraction layer so that simulated data can be seamlessly upgraded to live transport feeds:

```
[Bus GPS Device (AIS-140)] 
         │ 
         ▼ (MQTT / HTTP Telemetry)
[IoT Gateway / Ingestion API] 
         │ 
         ▼ POST /api/buses/[id]/location
[Telangana Smart RTC Engine]
         │
         ├──> [ETA Engine: Distance / Speed / Traffic delay]
         ├──> [Occupancy Estimator: Passenger counter / Ticketing API]
         └──> [PostgreSQL Telemetry Log]
         │
         ▼ (SSE / Polling / WebSocket)
[Passenger Mobile / Web Client]
```

To connect real buses:
1. Configure vehicle GPS units or mobile driver terminals to POST coordinate payloads to `/api/buses/[id]/location`.
2. Connect automated fare collection (AFCS) or ticket vending machine (ETIM) data to update `occupiedSeats` in `BusOccupancy`.
3. Switch the `isSimulated` flag on target buses to `false`.
=======
# TransitSense
>>>>>>> 70be22510f454d23b2f9ebf2df27e7ad1d1802b8
