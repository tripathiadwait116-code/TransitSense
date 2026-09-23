export interface SeedStop {
  id: string;
  name: string;
  code: string;
  latitude: number;
  longitude: number;
  landmark: string;
  city: string;
}

export interface SeedRouteStop {
  stopId: string;
  stopSequence: number;
  distanceToNextKm: number;
  estimatedTravelTimeToNextMin: number;
}

export interface SeedRoute {
  id: string;
  routeNumber: string;
  routeName: string;
  startPoint: string;
  destination: string;
  totalDistanceKm: number;
  estimatedDurationMin: number;
  trafficCondition: 'LOW' | 'MODERATE' | 'HEAVY';
  delayMinutes: number;
  trafficDescription: string;
  stops: SeedRouteStop[];
}

export interface SeedBus {
  id: string;
  busNumber: string;
  registrationNumber: string;
  capacity: number;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'DELAYED';
  isSimulated: boolean;
  routeId: string;
  currentStopIndex: number;
  progressBetweenStops: number; // 0.0 to 1.0
  speed: number;
  occupiedSeats: number;
}

export const SEED_STOPS: SeedStop[] = [
  // Route 218 & related stops
  { id: "stop-koti", name: "Koti Bus Station", code: "HYD-KOTI-01", latitude: 17.3828, longitude: 78.4842, landmark: "Women's College", city: "Hyderabad" },
  { id: "stop-abids", name: "Abids GPO", code: "HYD-ABID-02", latitude: 17.3892, longitude: 78.4754, landmark: "General Post Office", city: "Hyderabad" },
  { id: "stop-nampally", name: "Nampally Station", code: "HYD-NAMP-03", latitude: 17.3921, longitude: 78.4682, landmark: "Railway Station", city: "Hyderabad" },
  { id: "stop-lakdikapul", name: "Lakdikapul", code: "HYD-LAKD-04", latitude: 17.4042, longitude: 78.4633, landmark: "Global Hospital", city: "Hyderabad" },
  { id: "stop-khairatabad", name: "Khairatabad", code: "HYD-KHAIR-05", latitude: 17.4125, longitude: 78.4589, landmark: "Khairatabad Flyover", city: "Hyderabad" },
  { id: "stop-panjagutta", name: "Panjagutta", code: "HYD-PANJ-06", latitude: 17.4258, longitude: 78.4514, landmark: "Central Mall", city: "Hyderabad" },
  { id: "stop-ameerpet", name: "Ameerpet Metro", code: "HYD-AMRP-07", latitude: 17.4374, longitude: 78.4482, landmark: "Ameerpet Metro Interchange", city: "Hyderabad" },
  { id: "stop-srnagar", name: "SR Nagar", code: "HYD-SRNG-08", latitude: 17.4436, longitude: 78.4438, landmark: "Umesh Chandra Statue", city: "Hyderabad" },
  { id: "stop-erragadda", name: "Erragadda", code: "HYD-ERRA-09", latitude: 17.4529, longitude: 78.4372, landmark: "St. Theresa Hospital", city: "Hyderabad" },
  { id: "stop-bharatnagar", name: "Bharat Nagar", code: "HYD-BHAR-10", latitude: 17.4632, longitude: 78.4285, landmark: "Flyover", city: "Hyderabad" },
  { id: "stop-kukatpally", name: "Kukatpally", code: "HYD-KUKT-11", latitude: 17.4849, longitude: 78.4138, landmark: "Kukatpally Bus Depot", city: "Hyderabad" },
  { id: "stop-kphb", name: "KPHB Colony", code: "HYD-KPHB-12", latitude: 17.4932, longitude: 78.4017, landmark: "Forum Sujana Mall", city: "Hyderabad" },
  { id: "stop-jntu", name: "JNTU Hyderabad", code: "HYD-JNTU-13", latitude: 17.4985, longitude: 78.3912, landmark: "University Main Gate", city: "Hyderabad" },
  { id: "stop-miyapur", name: "Miyapur Metro", code: "HYD-MIYA-14", latitude: 17.5142, longitude: 78.3698, landmark: "Metro Terminal Depot", city: "Hyderabad" },
  { id: "stop-chandanagar", name: "Chanda Nagar", code: "HYD-CHND-15", latitude: 17.4952, longitude: 78.3284, landmark: "HUDA Market", city: "Hyderabad" },
  { id: "stop-bhel", name: "BHEL X Roads", code: "HYD-BHEL-16", latitude: 17.5121, longitude: 78.2982, landmark: "BHEL Township Gate", city: "Hyderabad" },
  { id: "stop-patancheru", name: "Patancheru Bus Station", code: "HYD-PATN-17", latitude: 17.5312, longitude: 78.2641, landmark: "RTC Depot Patancheru", city: "Hyderabad" },

  // Secunderabad & Route 25A
  { id: "stop-secunderabad", name: "Secunderabad Station", code: "HYD-SC-01", latitude: 17.4339, longitude: 78.5015, landmark: "Secunderabad Junction", city: "Secunderabad" },
  { id: "stop-paradise", name: "Paradise", code: "HYD-PAR-02", latitude: 17.4416, longitude: 78.4878, landmark: "Paradise Circle", city: "Secunderabad" },
  { id: "stop-ranigunj", name: "Ranigunj", code: "HYD-RANI-03", latitude: 17.4285, longitude: 78.4891, landmark: "RTC Depot 1", city: "Secunderabad" },
  { id: "stop-tankbund", name: "Tank Bund", code: "HYD-TANK-04", latitude: 17.4239, longitude: 78.4738, landmark: "Buddha Statue Viewpoint", city: "Hyderabad" },
  { id: "stop-secretariat", name: "BR Ambedkar Secretariat", code: "HYD-SECR-05", latitude: 17.4082, longitude: 78.4715, landmark: "New Secretariat Complex", city: "Hyderabad" },
  { id: "stop-assembly", name: "Telangana Assembly", code: "HYD-ASSM-06", latitude: 17.3995, longitude: 78.4682, landmark: "Public Gardens", city: "Hyderabad" },
  { id: "stop-afzalgunj", name: "Afzalgunj", code: "HYD-AFZL-07", latitude: 17.3752, longitude: 78.4776, landmark: "Osmania General Hospital", city: "Hyderabad" },
  { id: "stop-charminar", name: "Charminar", code: "HYD-CHAR-08", latitude: 17.3616, longitude: 78.4747, landmark: "Historic Monument", city: "Hyderabad" },

  // Route 10H stops (Hitec City / Madhapur)
  { id: "stop-begumpet", name: "Begumpet Airport", code: "HYD-BEGM-01", latitude: 17.4468, longitude: 78.4674, landmark: "Old Airport Road", city: "Hyderabad" },
  { id: "stop-jubileehills", name: "Jubilee Hills Checkpost", code: "HYD-JUBI-02", latitude: 17.4289, longitude: 78.4112, landmark: "Checkpost Metro", city: "Hyderabad" },
  { id: "stop-madhapur", name: "Madhapur Police Station", code: "HYD-MADH-03", latitude: 17.4421, longitude: 78.3908, landmark: "Main Road", city: "Hyderabad" },
  { id: "stop-cybertowers", name: "Cyber Towers (Hitec City)", code: "HYD-CYBR-04", latitude: 17.4504, longitude: 78.3809, landmark: "Cyber Towers Junction", city: "Hyderabad" },
  { id: "stop-kondapur", name: "Kondapur Bus Stand", code: "HYD-KOND-05", latitude: 17.4681, longitude: 78.3612, landmark: "RTA Office Kondapur", city: "Hyderabad" },

  // Route 221 stops
  { id: "stop-dilsukhnagar", name: "Dilsukhnagar Depot", code: "HYD-DIL-01", latitude: 17.3688, longitude: 78.5247, landmark: "Sai Baba Temple", city: "Hyderabad" },
  { id: "stop-malakpet", name: "Malakpet", code: "HYD-MALK-02", latitude: 17.3748, longitude: 78.4998, landmark: "Race Course", city: "Hyderabad" },
  { id: "stop-masabtank", name: "Masab Tank", code: "HYD-MSAB-03", latitude: 17.4012, longitude: 78.4485, landmark: "JNTU Fine Arts", city: "Hyderabad" },
  { id: "stop-mehdipatnam", name: "Mehdipatnam Rythu Bazar", code: "HYD-MEHD-04", latitude: 17.3916, longitude: 78.4365, landmark: "Bus Terminal", city: "Hyderabad" },
  { id: "stop-tolichowki", name: "Tolichowki", code: "HYD-TOLI-05", latitude: 17.3985, longitude: 78.4121, landmark: "Tolichowki Flyover", city: "Hyderabad" },
  { id: "stop-gachibowli", name: "Gachibowli Stadium", code: "HYD-GACH-06", latitude: 17.4452, longitude: 78.3498, landmark: "Sports Complex", city: "Hyderabad" },
  { id: "stop-lingampally", name: "Lingampally Station", code: "HYD-LING-07", latitude: 17.4912, longitude: 78.3189, landmark: "Railway Station", city: "Hyderabad" },

  // Route 290 stops (ECIL)
  { id: "stop-tarnaka", name: "Tarnaka Metro", code: "HYD-TARN-01", latitude: 17.4281, longitude: 78.5312, landmark: "Osmania University Gate", city: "Secunderabad" },
  { id: "stop-habsiguda", name: "Habsiguda X Roads", code: "HYD-HABS-02", latitude: 17.4128, longitude: 78.5521, landmark: "CCMB", city: "Hyderabad" },
  { id: "stop-nacharam", name: "Nacharam Industrial Area", code: "HYD-NACH-03", latitude: 17.4298, longitude: 78.5684, landmark: "ESI Hospital", city: "Hyderabad" },
  { id: "stop-ecil", name: "ECIL 'X' Roads", code: "HYD-ECIL-04", latitude: 17.4678, longitude: 78.5798, landmark: "ECIL Bus Terminal", city: "Hyderabad" },
];

export const SEED_ROUTES: SeedRoute[] = [
  {
    id: "route-218",
    routeNumber: "218",
    routeName: "Koti Bus Station to Patancheru",
    startPoint: "Koti Bus Station",
    destination: "Patancheru Bus Station",
    totalDistanceKm: 36.5,
    estimatedDurationMin: 75,
    trafficCondition: "MODERATE",
    delayMinutes: 4,
    trafficDescription: "Moderate traffic along Ameerpet and Miyapur corridor.",
    stops: [
      { stopId: "stop-koti", stopSequence: 1, distanceToNextKm: 1.2, estimatedTravelTimeToNextMin: 4 },
      { stopId: "stop-abids", stopSequence: 2, distanceToNextKm: 1.1, estimatedTravelTimeToNextMin: 3 },
      { stopId: "stop-nampally", stopSequence: 3, distanceToNextKm: 1.6, estimatedTravelTimeToNextMin: 4 },
      { stopId: "stop-lakdikapul", stopSequence: 4, distanceToNextKm: 1.3, estimatedTravelTimeToNextMin: 3 },
      { stopId: "stop-khairatabad", stopSequence: 5, distanceToNextKm: 1.8, estimatedTravelTimeToNextMin: 4 },
      { stopId: "stop-panjagutta", stopSequence: 6, distanceToNextKm: 1.4, estimatedTravelTimeToNextMin: 4 },
      { stopId: "stop-ameerpet", stopSequence: 7, distanceToNextKm: 1.2, estimatedTravelTimeToNextMin: 3 },
      { stopId: "stop-srnagar", stopSequence: 8, distanceToNextKm: 1.5, estimatedTravelTimeToNextMin: 4 },
      { stopId: "stop-erragadda", stopSequence: 9, distanceToNextKm: 1.6, estimatedTravelTimeToNextMin: 4 },
      { stopId: "stop-bharatnagar", stopSequence: 10, distanceToNextKm: 3.2, estimatedTravelTimeToNextMin: 7 },
      { stopId: "stop-kukatpally", stopSequence: 11, distanceToNextKm: 1.8, estimatedTravelTimeToNextMin: 4 },
      { stopId: "stop-kphb", stopSequence: 12, distanceToNextKm: 1.4, estimatedTravelTimeToNextMin: 3 },
      { stopId: "stop-jntu", stopSequence: 13, distanceToNextKm: 2.8, estimatedTravelTimeToNextMin: 6 },
      { stopId: "stop-miyapur", stopSequence: 14, distanceToNextKm: 4.5, estimatedTravelTimeToNextMin: 9 },
      { stopId: "stop-chandanagar", stopSequence: 15, distanceToNextKm: 3.6, estimatedTravelTimeToNextMin: 7 },
      { stopId: "stop-bhel", stopSequence: 16, distanceToNextKm: 4.2, estimatedTravelTimeToNextMin: 8 },
      { stopId: "stop-patancheru", stopSequence: 17, distanceToNextKm: 0, estimatedTravelTimeToNextMin: 0 },
    ],
  },
  {
    id: "route-25a",
    routeNumber: "25A",
    routeName: "Secunderabad Station to Charminar",
    startPoint: "Secunderabad Station",
    destination: "Charminar",
    totalDistanceKm: 14.8,
    estimatedDurationMin: 40,
    trafficCondition: "LOW",
    delayMinutes: 0,
    trafficDescription: "Free flowing traffic along Tank Bund & Old City route.",
    stops: [
      { stopId: "stop-secunderabad", stopSequence: 1, distanceToNextKm: 1.8, estimatedTravelTimeToNextMin: 5 },
      { stopId: "stop-paradise", stopSequence: 2, distanceToNextKm: 1.5, estimatedTravelTimeToNextMin: 4 },
      { stopId: "stop-ranigunj", stopSequence: 3, distanceToNextKm: 1.9, estimatedTravelTimeToNextMin: 5 },
      { stopId: "stop-tankbund", stopSequence: 4, distanceToNextKm: 2.1, estimatedTravelTimeToNextMin: 6 },
      { stopId: "stop-secretariat", stopSequence: 5, distanceToNextKm: 1.2, estimatedTravelTimeToNextMin: 4 },
      { stopId: "stop-assembly", stopSequence: 6, distanceToNextKm: 2.5, estimatedTravelTimeToNextMin: 7 },
      { stopId: "stop-afzalgunj", stopSequence: 7, distanceToNextKm: 1.8, estimatedTravelTimeToNextMin: 6 },
      { stopId: "stop-charminar", stopSequence: 8, distanceToNextKm: 0, estimatedTravelTimeToNextMin: 0 },
    ],
  },
  {
    id: "route-10h",
    routeNumber: "10H",
    routeName: "Secunderabad Station to Kondapur",
    startPoint: "Secunderabad Station",
    destination: "Kondapur Bus Stand",
    totalDistanceKm: 21.2,
    estimatedDurationMin: 55,
    trafficCondition: "HEAVY",
    delayMinutes: 12,
    trafficDescription: "Heavy bottleneck around Jubilee Hills Checkpost and Cyber Towers.",
    stops: [
      { stopId: "stop-secunderabad", stopSequence: 1, distanceToNextKm: 1.8, estimatedTravelTimeToNextMin: 5 },
      { stopId: "stop-paradise", stopSequence: 2, distanceToNextKm: 2.3, estimatedTravelTimeToNextMin: 6 },
      { stopId: "stop-begumpet", stopSequence: 3, distanceToNextKm: 3.1, estimatedTravelTimeToNextMin: 8 },
      { stopId: "stop-panjagutta", stopSequence: 4, distanceToNextKm: 4.2, estimatedTravelTimeToNextMin: 12 },
      { stopId: "stop-jubileehills", stopSequence: 5, distanceToNextKm: 2.6, estimatedTravelTimeToNextMin: 7 },
      { stopId: "stop-madhapur", stopSequence: 6, distanceToNextKm: 1.9, estimatedTravelTimeToNextMin: 6 },
      { stopId: "stop-cybertowers", stopSequence: 7, distanceToNextKm: 2.8, estimatedTravelTimeToNextMin: 8 },
      { stopId: "stop-kondapur", stopSequence: 8, distanceToNextKm: 0, estimatedTravelTimeToNextMin: 0 },
    ],
  },
  {
    id: "route-221",
    routeNumber: "221",
    routeName: "Dilsukhnagar to Lingampally",
    startPoint: "Dilsukhnagar Depot",
    destination: "Lingampally Station",
    totalDistanceKm: 32.0,
    estimatedDurationMin: 68,
    trafficCondition: "MODERATE",
    delayMinutes: 5,
    trafficDescription: "Moderate density at Mehdipatnam flyover and Gachibowli.",
    stops: [
      { stopId: "stop-dilsukhnagar", stopSequence: 1, distanceToNextKm: 2.1, estimatedTravelTimeToNextMin: 6 },
      { stopId: "stop-malakpet", stopSequence: 2, distanceToNextKm: 2.4, estimatedTravelTimeToNextMin: 6 },
      { stopId: "stop-koti", stopSequence: 3, distanceToNextKm: 2.6, estimatedTravelTimeToNextMin: 7 },
      { stopId: "stop-lakdikapul", stopSequence: 4, distanceToNextKm: 2.2, estimatedTravelTimeToNextMin: 5 },
      { stopId: "stop-masabtank", stopSequence: 5, distanceToNextKm: 1.8, estimatedTravelTimeToNextMin: 4 },
      { stopId: "stop-mehdipatnam", stopSequence: 6, distanceToNextKm: 2.9, estimatedTravelTimeToNextMin: 7 },
      { stopId: "stop-tolichowki", stopSequence: 7, distanceToNextKm: 6.8, estimatedTravelTimeToNextMin: 14 },
      { stopId: "stop-gachibowli", stopSequence: 8, distanceToNextKm: 7.2, estimatedTravelTimeToNextMin: 15 },
      { stopId: "stop-lingampally", stopSequence: 9, distanceToNextKm: 0, estimatedTravelTimeToNextMin: 0 },
    ],
  },
  {
    id: "route-290",
    routeNumber: "290",
    routeName: "Secunderabad Station to ECIL X Roads",
    startPoint: "Secunderabad Station",
    destination: "ECIL 'X' Roads",
    totalDistanceKm: 12.5,
    estimatedDurationMin: 32,
    trafficCondition: "LOW",
    delayMinutes: 0,
    trafficDescription: "Smooth traffic flow through Tarnaka and Habsiguda.",
    stops: [
      { stopId: "stop-secunderabad", stopSequence: 1, distanceToNextKm: 3.5, estimatedTravelTimeToNextMin: 8 },
      { stopId: "stop-tarnaka", stopSequence: 2, distanceToNextKm: 2.2, estimatedTravelTimeToNextMin: 5 },
      { stopId: "stop-habsiguda", stopSequence: 3, distanceToNextKm: 2.6, estimatedTravelTimeToNextMin: 6 },
      { stopId: "stop-nacharam", stopSequence: 4, distanceToNextKm: 4.2, estimatedTravelTimeToNextMin: 10 },
      { stopId: "stop-ecil", stopSequence: 5, distanceToNextKm: 0, estimatedTravelTimeToNextMin: 0 },
    ],
  },
];

export const SEED_BUSES: SeedBus[] = [
  {
    id: "bus-218a",
    busNumber: "218",
    registrationNumber: "TS 09 Z 4812",
    capacity: 60,
    status: "ACTIVE",
    isSimulated: true,
    routeId: "route-218",
    currentStopIndex: 5, // Panjagutta -> Ameerpet
    progressBetweenStops: 0.45,
    speed: 32,
    occupiedSeats: 42, // 70% Moderate
  },
  {
    id: "bus-218b",
    busNumber: "218-B",
    registrationNumber: "TS 09 Z 4813",
    capacity: 60,
    status: "ACTIVE",
    isSimulated: true,
    routeId: "route-218",
    currentStopIndex: 12, // KPHB -> JNTU
    progressBetweenStops: 0.70,
    speed: 38,
    occupiedSeats: 54, // 90% High
  },
  {
    id: "bus-25a",
    busNumber: "25A",
    registrationNumber: "TS 09 Z 2501",
    capacity: 60,
    status: "ACTIVE",
    isSimulated: true,
    routeId: "route-25a",
    currentStopIndex: 2, // Paradise -> Ranigunj
    progressBetweenStops: 0.35,
    speed: 28,
    occupiedSeats: 22, // 36% Low (Many seats)
  },
  {
    id: "bus-10h",
    busNumber: "10H",
    registrationNumber: "TS 09 Z 1010",
    capacity: 60,
    status: "DELAYED",
    isSimulated: true,
    routeId: "route-10h",
    currentStopIndex: 4, // Panjagutta -> Jubilee Hills
    progressBetweenStops: 0.20,
    speed: 14,
    occupiedSeats: 58, // 97% Full
  },
  {
    id: "bus-221",
    busNumber: "221",
    registrationNumber: "TS 09 Z 2210",
    capacity: 60,
    status: "ACTIVE",
    isSimulated: true,
    routeId: "route-221",
    currentStopIndex: 4, // Lakdikapul -> Masab Tank
    progressBetweenStops: 0.60,
    speed: 30,
    occupiedSeats: 35, // 58% Moderate
  },
  {
    id: "bus-290",
    busNumber: "290",
    registrationNumber: "TS 09 Z 2901",
    capacity: 60,
    status: "ACTIVE",
    isSimulated: true,
    routeId: "route-290",
    currentStopIndex: 1, // Secunderabad -> Tarnaka
    progressBetweenStops: 0.50,
    speed: 36,
    occupiedSeats: 19, // 31% Low
  },
];
