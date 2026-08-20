/**
 * ResQNet rescuer-side domain data (prototype mock layer).
 * Pure, browser-safe, no I/O — safe for SSR.
 */

export type Priority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type IncidentStatus =
  | "SOS RECEIVED"
  | "ACKNOWLEDGED"
  | "RESCUER ASSIGNED"
  | "EN ROUTE"
  | "ON SCENE"
  | "RESCUE IN PROGRESS"
  | "RESOLVED";

export const STATUS_FLOW: IncidentStatus[] = [
  "SOS RECEIVED",
  "ACKNOWLEDGED",
  "RESCUER ASSIGNED",
  "EN ROUTE",
  "ON SCENE",
  "RESCUE IN PROGRESS",
  "RESOLVED",
];

export type CommStatus = "LIVE" | "RELAYED" | "DELAYED" | "LOST";

export type Victim = {
  id: string;
  name: string;
  age: number;
  people: number;
  medical: string[];
  bloodType: string;
  battery: number;
  lastComms: string;
  languages: string[];
  locationHistory: { time: string; label: string; accuracy: number }[];
  history: { id: string; date: string; type: string; outcome: string }[];
};

export type Message = {
  id: string;
  from: "victim" | "rescuer";
  text: string;
  time: string;
  delivery: "SENT" | "RELAYED" | "DELIVERED" | "PENDING" | "FAILED";
  hops?: string[];
};

export type Incident = {
  id: string;
  code: string;
  type: string;
  priority: Priority;
  status: IncidentStatus;
  locationLabel: string;
  coords: { lat: number; lon: number };
  /** normalized 0-100 position on the tactical map */
  map: { x: number; y: number };
  gpsAccuracy: number;
  people: number;
  receivedAt: string;
  minutesAgo: number;
  distanceKm: number;
  etaMin: number;
  comms: CommStatus;
  lastUpdate: string;
  lastMessage: string;
  route: string[];
  assignedTo?: string;
  victim: Victim;
  messages: Message[];
  timeline: { status: IncidentStatus; time: string; by: string }[];
  responseMin?: number;
  outcome?: string;
};

export type Rescuer = {
  id: string;
  name: string;
  role: string;
  team: string;
  status: "AVAILABLE" | "ASSIGNED" | "ON SCENE" | "OFF DUTY";
  distanceKm: number;
  etaMin: number;
  battery: number;
  skills: string[];
  map: { x: number; y: number };
};

export type MeshNode = {
  id: string;
  label: string;
  kind: "USER" | "RELAY" | "GATEWAY" | "RESCUER" | "SAFE";
  online: boolean;
  battery: number;
  linkQuality: number;
  lastSeen: string;
  peers: string[];
  map: { x: number; y: number };
};

export const OPERATOR = {
  id: "RSQ-4471",
  name: "Cmdr. A. Verma",
  role: "Field Coordinator / SAR Lead",
  team: "NDRF Bravo-2",
  org: "National Disaster Response Force",
  cert: ["Swift Water Rescue", "Rope Access L3", "TCCC Medic"],
  device: "ResQNet Node H-12",
  battery: 68,
  gps: "LOCKED · ±4 m",
  shift: "18:00 – 06:00",
};

const victim = (v: Partial<Victim> & { id: string; name: string }): Victim => ({
  age: 34,
  people: 1,
  medical: [],
  bloodType: "O+",
  battery: 40,
  lastComms: "2 min ago",
  languages: ["Hindi", "English"],
  locationHistory: [
    { time: "19:44", label: "Sector 7 · Riverbank Rd", accuracy: 12 },
    { time: "19:12", label: "Sector 7 · Market Lane", accuracy: 38 },
  ],
  history: [],
  ...v,
});

export const INCIDENTS: Incident[] = [
  {
    id: "1042",
    code: "EMERGENCY #1042",
    type: "Structural Collapse · Trapped",
    priority: "CRITICAL",
    status: "SOS RECEIVED",
    locationLabel: "Sector 7 · Riverbank Rd, Blk C",
    coords: { lat: 26.8412, lon: 80.9241 },
    map: { x: 34, y: 38 },
    gpsAccuracy: 8,
    people: 4,
    receivedAt: "19:52",
    minutesAgo: 6,
    distanceKm: 2.4,
    etaMin: 9,
    comms: "LIVE",
    lastUpdate: "40 s ago",
    lastMessage: "Slab fell. Two adults, two kids. Water rising.",
    route: ["USR-1042", "RLY-07", "RLY-03", "GW-01"],
    victim: victim({
      id: "USR-1042",
      name: "Meera Kulkarni",
      age: 38,
      people: 4,
      medical: ["Asthma — inhaler lost", "Child, 6 — bleeding forearm"],
      battery: 21,
      lastComms: "40 s ago",
      history: [{ id: "0981", date: "12 Aug", type: "Flood evacuation", outcome: "Resolved" }],
    }),
    messages: [
      {
        id: "m1",
        from: "victim",
        text: "SOS — building collapsed, we are under the stairwell.",
        time: "19:52",
        delivery: "RELAYED",
        hops: ["RLY-07", "RLY-03", "GW-01"],
      },
      { id: "m2", from: "rescuer", text: "We received your SOS.", time: "19:54", delivery: "DELIVERED" },
      {
        id: "m3",
        from: "victim",
        text: "Slab fell. Two adults, two kids. Water rising.",
        time: "19:57",
        delivery: "RELAYED",
        hops: ["RLY-07", "GW-01"],
      },
    ],
    timeline: [{ status: "SOS RECEIVED", time: "19:52", by: "GW-01 uplink" }],
  },
  {
    id: "1041",
    code: "EMERGENCY #1041",
    type: "Medical · Cardiac Distress",
    priority: "CRITICAL",
    status: "EN ROUTE",
    locationLabel: "Sector 4 · Hill Colony, House 22",
    coords: { lat: 26.8501, lon: 80.9382 },
    map: { x: 62, y: 24 },
    gpsAccuracy: 22,
    people: 2,
    receivedAt: "19:31",
    minutesAgo: 27,
    distanceKm: 5.1,
    etaMin: 14,
    comms: "RELAYED",
    lastUpdate: "3 min ago",
    lastMessage: "He is conscious but chest pain worse.",
    route: ["USR-1041", "RLY-11", "GW-02"],
    assignedTo: "RSQ-2210",
    victim: victim({
      id: "USR-1041",
      name: "Suresh Nair",
      age: 67,
      people: 2,
      medical: ["Known cardiac patient", "On blood thinners", "Diabetic Type II"],
      bloodType: "B-",
      battery: 55,
      lastComms: "3 min ago",
    }),
    messages: [
      { id: "m1", from: "victim", text: "Father having chest pain, cannot walk.", time: "19:31", delivery: "RELAYED" },
      { id: "m2", from: "rescuer", text: "Help is on the way.", time: "19:35", delivery: "DELIVERED" },
      { id: "m3", from: "victim", text: "He is conscious but chest pain worse.", time: "19:55", delivery: "RELAYED" },
    ],
    timeline: [
      { status: "SOS RECEIVED", time: "19:31", by: "GW-02 uplink" },
      { status: "ACKNOWLEDGED", time: "19:33", by: "RSQ-4471" },
      { status: "RESCUER ASSIGNED", time: "19:36", by: "RSQ-4471" },
      { status: "EN ROUTE", time: "19:41", by: "RSQ-2210" },
    ],
  },
  {
    id: "1039",
    code: "EMERGENCY #1039",
    type: "Flood · Stranded on Roof",
    priority: "HIGH",
    status: "ON SCENE",
    locationLabel: "Sector 9 · Old Ferry Ghat",
    coords: { lat: 26.8298, lon: 80.9127 },
    map: { x: 20, y: 68 },
    gpsAccuracy: 45,
    people: 7,
    receivedAt: "18:58",
    minutesAgo: 60,
    distanceKm: 3.8,
    etaMin: 0,
    comms: "RELAYED",
    lastUpdate: "8 min ago",
    lastMessage: "Boat visible. We are waving.",
    route: ["USR-1039", "RLY-02", "RLY-03", "GW-01"],
    assignedTo: "RSQ-1187",
    victim: victim({
      id: "USR-1039",
      name: "Ferry Ghat Group (Anil Das)",
      people: 7,
      medical: ["1 elderly, mobility limited", "Hypothermia risk — wet 3h"],
      battery: 12,
      lastComms: "8 min ago",
    }),
    messages: [
      { id: "m1", from: "victim", text: "Water at second floor, 7 of us on roof.", time: "18:58", delivery: "RELAYED" },
      { id: "m2", from: "rescuer", text: "Stay where you are.", time: "19:02", delivery: "DELIVERED" },
      { id: "m3", from: "victim", text: "Boat visible. We are waving.", time: "19:50", delivery: "RELAYED" },
    ],
    timeline: [
      { status: "SOS RECEIVED", time: "18:58", by: "GW-01 uplink" },
      { status: "ACKNOWLEDGED", time: "19:00", by: "RSQ-4471" },
      { status: "RESCUER ASSIGNED", time: "19:04", by: "RSQ-4471" },
      { status: "EN ROUTE", time: "19:10", by: "RSQ-1187" },
      { status: "ON SCENE", time: "19:48", by: "RSQ-1187" },
    ],
  },
  {
    id: "1036",
    code: "EMERGENCY #1036",
    type: "Missing Person · Child",
    priority: "HIGH",
    status: "ACKNOWLEDGED",
    locationLabel: "Sector 2 · Relief Camp perimeter",
    coords: { lat: 26.8577, lon: 80.9048 },
    map: { x: 46, y: 12 },
    gpsAccuracy: 120,
    people: 1,
    receivedAt: "18:20",
    minutesAgo: 98,
    distanceKm: 6.9,
    etaMin: 21,
    comms: "DELAYED",
    lastUpdate: "26 min ago",
    lastMessage: "Last seen near water point at 17:40.",
    route: ["USR-1036", "RLY-05", "RLY-11", "GW-02"],
    victim: victim({
      id: "USR-1036",
      name: "Reported by: Fatima S.",
      people: 1,
      medical: ["Child, 8 — non-verbal"],
      battery: 74,
      lastComms: "26 min ago",
    }),
    messages: [
      { id: "m1", from: "victim", text: "My son is missing from the camp.", time: "18:20", delivery: "RELAYED" },
      { id: "m2", from: "rescuer", text: "We received your SOS.", time: "18:26", delivery: "DELIVERED" },
    ],
    timeline: [
      { status: "SOS RECEIVED", time: "18:20", by: "GW-02 uplink" },
      { status: "ACKNOWLEDGED", time: "18:26", by: "RSQ-4471" },
    ],
  },
  {
    id: "1033",
    code: "EMERGENCY #1033",
    type: "Fire · Gas Leak Risk",
    priority: "MEDIUM",
    status: "RESCUE IN PROGRESS",
    locationLabel: "Sector 5 · Transport Depot",
    coords: { lat: 26.8455, lon: 80.9455 },
    map: { x: 78, y: 52 },
    gpsAccuracy: 15,
    people: 3,
    receivedAt: "17:44",
    minutesAgo: 134,
    distanceKm: 8.2,
    etaMin: 0,
    comms: "LIVE",
    lastUpdate: "12 min ago",
    lastMessage: "Smoke reducing, crew on site.",
    route: ["USR-1033", "RLY-09", "GW-02"],
    assignedTo: "RSQ-3390",
    victim: victim({
      id: "USR-1033",
      name: "Depot Watchman (R. Yadav)",
      people: 3,
      medical: ["Smoke inhalation — mild"],
      battery: 61,
      lastComms: "12 min ago",
    }),
    messages: [
      { id: "m1", from: "victim", text: "Fire in the shed, cylinders inside.", time: "17:44", delivery: "RELAYED" },
      { id: "m2", from: "rescuer", text: "Crew dispatched. Move 100 m upwind.", time: "17:49", delivery: "DELIVERED" },
    ],
    timeline: [
      { status: "SOS RECEIVED", time: "17:44", by: "GW-02 uplink" },
      { status: "ACKNOWLEDGED", time: "17:46", by: "RSQ-4471" },
      { status: "RESCUER ASSIGNED", time: "17:49", by: "RSQ-4471" },
      { status: "EN ROUTE", time: "17:55", by: "RSQ-3390" },
      { status: "ON SCENE", time: "18:20", by: "RSQ-3390" },
      { status: "RESCUE IN PROGRESS", time: "18:31", by: "RSQ-3390" },
    ],
  },
  {
    id: "1028",
    code: "EMERGENCY #1028",
    type: "Evacuation Assist · Elderly",
    priority: "LOW",
    status: "RESOLVED",
    locationLabel: "Sector 3 · Temple Street",
    coords: { lat: 26.8611, lon: 80.9302 },
    map: { x: 58, y: 78 },
    gpsAccuracy: 10,
    people: 2,
    receivedAt: "16:02",
    minutesAgo: 236,
    distanceKm: 4.4,
    etaMin: 0,
    comms: "LOST",
    lastUpdate: "1 h ago",
    lastMessage: "Both moved to Relief Camp 2. Thank you.",
    route: ["USR-1028", "RLY-04", "GW-01"],
    assignedTo: "RSQ-1187",
    responseMin: 38,
    outcome: "2 evacuated to Relief Camp 2 · no injuries",
    victim: victim({
      id: "USR-1028",
      name: "Kamala Devi",
      age: 81,
      people: 2,
      medical: ["Wheelchair user"],
      battery: 33,
      lastComms: "1 h ago",
    }),
    messages: [
      { id: "m1", from: "victim", text: "Need help moving my mother out.", time: "16:02", delivery: "RELAYED" },
      { id: "m2", from: "rescuer", text: "Team assigned, 25 min out.", time: "16:11", delivery: "DELIVERED" },
    ],
    timeline: [
      { status: "SOS RECEIVED", time: "16:02", by: "GW-01 uplink" },
      { status: "ACKNOWLEDGED", time: "16:05", by: "RSQ-4471" },
      { status: "RESCUER ASSIGNED", time: "16:11", by: "RSQ-4471" },
      { status: "EN ROUTE", time: "16:18", by: "RSQ-1187" },
      { status: "ON SCENE", time: "16:33", by: "RSQ-1187" },
      { status: "RESCUE IN PROGRESS", time: "16:35", by: "RSQ-1187" },
      { status: "RESOLVED", time: "16:40", by: "RSQ-1187" },
    ],
  },
];

export const RESCUERS: Rescuer[] = [
  {
    id: "RSQ-2210",
    name: "S. Bhatt",
    role: "Paramedic",
    team: "EMS Alpha",
    status: "ASSIGNED",
    distanceKm: 1.9,
    etaMin: 7,
    battery: 84,
    skills: ["ALS", "Trauma"],
    map: { x: 55, y: 32 },
  },
  {
    id: "RSQ-1187",
    name: "D. Rathore",
    role: "Swift Water Tech",
    team: "NDRF Bravo-2",
    status: "ON SCENE",
    distanceKm: 3.8,
    etaMin: 0,
    battery: 47,
    skills: ["Boat Ops", "Rope"],
    map: { x: 24, y: 63 },
  },
  {
    id: "RSQ-3390",
    name: "K. Iyer",
    role: "Fire Officer",
    team: "Fire Unit 3",
    status: "ASSIGNED",
    distanceKm: 8.0,
    etaMin: 0,
    battery: 62,
    skills: ["HazMat", "Extrication"],
    map: { x: 74, y: 49 },
  },
  {
    id: "RSQ-5502",
    name: "P. Sharma",
    role: "SAR Volunteer",
    team: "Civic Volunteers",
    status: "AVAILABLE",
    distanceKm: 2.7,
    etaMin: 11,
    battery: 91,
    skills: ["Search", "First Aid"],
    map: { x: 40, y: 46 },
  },
  {
    id: "RSQ-6614",
    name: "J. Thomas",
    role: "Rescue Engineer",
    team: "USAR Delta",
    status: "AVAILABLE",
    distanceKm: 4.6,
    etaMin: 16,
    battery: 73,
    skills: ["Shoring", "Breaching"],
    map: { x: 30, y: 26 },
  },
  {
    id: "RSQ-7781",
    name: "N. Qureshi",
    role: "Drone Spotter",
    team: "Recon Cell",
    status: "OFF DUTY",
    distanceKm: 11.2,
    etaMin: 34,
    battery: 18,
    skills: ["Aerial", "Mapping"],
    map: { x: 88, y: 74 },
  },
];

export const NODES: MeshNode[] = [
  { id: "GW-01", label: "Gateway · Command Post", kind: "GATEWAY", online: true, battery: 100, linkQuality: 96, lastSeen: "now", peers: ["RLY-03", "RLY-04"], map: { x: 50, y: 92 } },
  { id: "GW-02", label: "Gateway · Relief Camp 2", kind: "GATEWAY", online: true, battery: 88, linkQuality: 81, lastSeen: "now", peers: ["RLY-11", "RLY-09"], map: { x: 84, y: 88 } },
  { id: "RLY-03", label: "Relay · Water Tower", kind: "RELAY", online: true, battery: 64, linkQuality: 78, lastSeen: "12 s", peers: ["RLY-07", "RLY-02", "GW-01"], map: { x: 38, y: 66 } },
  { id: "RLY-04", label: "Relay · Temple St", kind: "RELAY", online: true, battery: 51, linkQuality: 62, lastSeen: "48 s", peers: ["GW-01"], map: { x: 62, y: 70 } },
  { id: "RLY-07", label: "Relay · Riverbank Mast", kind: "RELAY", online: true, battery: 29, linkQuality: 54, lastSeen: "8 s", peers: ["USR-1042", "RLY-03"], map: { x: 34, y: 52 } },
  { id: "RLY-02", label: "Relay · Ferry Ghat", kind: "RELAY", online: true, battery: 18, linkQuality: 37, lastSeen: "2 m", peers: ["USR-1039", "RLY-03"], map: { x: 22, y: 60 } },
  { id: "RLY-11", label: "Relay · Hill Colony", kind: "RELAY", online: true, battery: 72, linkQuality: 69, lastSeen: "20 s", peers: ["USR-1041", "RLY-05", "GW-02"], map: { x: 72, y: 40 } },
  { id: "RLY-05", label: "Relay · Camp Perimeter", kind: "RELAY", online: false, battery: 4, linkQuality: 0, lastSeen: "26 m", peers: ["USR-1036", "RLY-11"], map: { x: 54, y: 22 } },
  { id: "RLY-09", label: "Relay · Depot Yard", kind: "RELAY", online: true, battery: 44, linkQuality: 58, lastSeen: "35 s", peers: ["USR-1033", "GW-02"], map: { x: 82, y: 62 } },
  { id: "RLY-14", label: "Relay · North Ridge", kind: "RELAY", online: false, battery: 0, linkQuality: 0, lastSeen: "3 h", peers: [], map: { x: 16, y: 20 } },
  { id: "USR-1042", label: "Victim · Blk C stairwell", kind: "USER", online: true, battery: 21, linkQuality: 41, lastSeen: "40 s", peers: ["RLY-07"], map: { x: 34, y: 38 } },
  { id: "USR-1041", label: "Victim · House 22", kind: "USER", online: true, battery: 55, linkQuality: 60, lastSeen: "3 m", peers: ["RLY-11"], map: { x: 62, y: 24 } },
  { id: "USR-1039", label: "Victim · Roof group (7)", kind: "USER", online: true, battery: 12, linkQuality: 26, lastSeen: "8 m", peers: ["RLY-02"], map: { x: 20, y: 68 } },
  { id: "USR-1036", label: "Victim · Camp report", kind: "USER", online: false, battery: 74, linkQuality: 0, lastSeen: "26 m", peers: ["RLY-05"], map: { x: 46, y: 12 } },
  { id: "SAFE-01", label: "Safe Zone · Relief Camp 2", kind: "SAFE", online: true, battery: 100, linkQuality: 90, lastSeen: "now", peers: ["GW-02"], map: { x: 90, y: 80 } },
  { id: "SAFE-02", label: "Safe Zone · School Shelter", kind: "SAFE", online: true, battery: 100, linkQuality: 74, lastSeen: "now", peers: ["GW-01"], map: { x: 44, y: 84 } },
];

export const COVERAGE_GAPS = [
  { id: "GAP-1", area: "North Ridge · Sector 1", reason: "RLY-14 offline 3 h · battery dead", severity: "CRITICAL" as Priority, lastContact: "3 h ago" },
  { id: "GAP-2", area: "Camp Perimeter · Sector 2", reason: "RLY-05 offline · 4% battery", severity: "HIGH" as Priority, lastContact: "26 min ago" },
  { id: "GAP-3", area: "Ferry Ghat · Sector 9", reason: "RLY-02 link quality 37% · flood risk", severity: "MEDIUM" as Priority, lastContact: "2 min ago" },
];

export const QUICK_REPLIES = [
  "We received your SOS.",
  "Help is on the way.",
  "Stay where you are.",
  "Are you injured?",
  "Can you move?",
  "Send your location.",
  "Conserve battery.",
];

export const TEAMS = [
  "NDRF Bravo-2",
  "EMS Alpha",
  "Fire Unit 3",
  "USAR Delta",
  "Civic Volunteers",
  "Recon Cell",
];

export function getIncident(id: string): Incident | undefined {
  return INCIDENTS.find((i) => i.id === id);
}

export const priorityClasses: Record<Priority, string> = {
  CRITICAL: "bg-critical text-critical-foreground border-critical",
  HIGH: "bg-active text-active-foreground border-active",
  MEDIUM: "bg-warn text-warn-foreground border-warn",
  LOW: "bg-muted text-muted-foreground border-border",
};

export const priorityText: Record<Priority, string> = {
  CRITICAL: "text-critical",
  HIGH: "text-active",
  MEDIUM: "text-warn",
  LOW: "text-muted-foreground",
};

export function statusTone(status: IncidentStatus) {
  if (status === "RESOLVED") return "text-safe";
  if (status === "SOS RECEIVED") return "text-critical";
  return "text-active";
}

export function commsTone(c: CommStatus) {
  return c === "LIVE"
    ? "text-safe"
    : c === "RELAYED"
      ? "text-mesh"
      : c === "DELAYED"
        ? "text-warn"
        : "text-critical";
}

export const NETWORK_STATE = {
  internet: false,
  cellular: false,
  gps: true,
  resqnet: true,
  nodesOnline: NODES.filter((n) => n.online).length,
  nodesTotal: NODES.length,
  meshLatencyMs: 1840,
  gatewayHops: 3,
};
