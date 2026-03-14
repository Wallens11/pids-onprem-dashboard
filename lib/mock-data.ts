// Mock operational data for the PIDS admin dashboard portfolio demo.

export interface Location {
  id: string
  stationName: string
  areaName: string
}

export interface Display {
  displayId: string
  name: string
  locationId: string
  type: "LED" | "LCD"
  resolution: string
  status: "online" | "offline"
  lastSeen: string
  currentTemplateId: string | null
}

export interface Train {
  trainNo: string
  serviceName: string
  origin: string
  destination: string
  platform: string
  eta: string
  etd: string
  status: "On Time" | "Delayed" | "Arrived" | "Cancelled"
  lastUpdated: string
}

export interface Announcement {
  id: string
  title: string
  message: string
  priority: "low" | "medium" | "high"
  targetType: "all" | "location" | "display"
  targetIds: string[]
  startAt: string
  endAt: string
  status: "scheduled" | "active" | "expired"
  pinned: boolean
  ticker: boolean
}

export interface Emergency {
  id: string
  message: string
  severity: "warning" | "critical"
  targetType: "all" | "location" | "group"
  targetIds: string[]
  startAt: string
  endAt: string | null
  active: boolean
}

export interface Template {
  templateId: string
  name: string
  zones: string[]
  theme: string
  lastEdited: string
}

export interface Media {
  id: string
  fileName: string
  type: "image" | "video"
  size: string
  tags: string[]
  uploadedBy: string
  uploadedAt: string
  url: string
}

export interface User {
  id: string
  name: string
  email: string
  role: "Admin" | "Operator" | "Viewer"
  status: "active" | "inactive"
}

export interface AuditLog {
  id: string
  time: string
  user: string
  action: string
  entityType: string
  entityId: string
  result: "success" | "failure"
}

export interface DisplayGroup {
  id: string
  name: string
  locationId: string
  displayIds: string[]
}

// Mock Data
export const locations: Location[] = [
  { id: "loc-1", stationName: "Jakarta Gambir", areaName: "Platform 1" },
  { id: "loc-2", stationName: "Jakarta Gambir", areaName: "Platform 2" },
  { id: "loc-3", stationName: "Jakarta Gambir", areaName: "Main Hall" },
  { id: "loc-4", stationName: "Bandung", areaName: "Platform 1" },
  { id: "loc-5", stationName: "Bandung", areaName: "Waiting Room" },
  { id: "loc-6", stationName: "Surabaya Gubeng", areaName: "Platform 1" },
  { id: "loc-7", stationName: "Surabaya Gubeng", areaName: "Platform 2" },
  { id: "loc-8", stationName: "Yogyakarta", areaName: "Main Hall" },
]

export const displays: Display[] = [
  {
    displayId: "DSP-001",
    name: "Gambir P1 Main",
    locationId: "loc-1",
    type: "LED",
    resolution: "1920x1080",
    status: "online",
    lastSeen: "2026-01-10T14:30:00",
    currentTemplateId: "tpl-1",
  },
  {
    displayId: "DSP-002",
    name: "Gambir P1 Side",
    locationId: "loc-1",
    type: "LCD",
    resolution: "1280x720",
    status: "online",
    lastSeen: "2026-01-10T14:28:00",
    currentTemplateId: "tpl-2",
  },
  {
    displayId: "DSP-003",
    name: "Gambir P2 Main",
    locationId: "loc-2",
    type: "LED",
    resolution: "1920x1080",
    status: "online",
    lastSeen: "2026-01-10T14:25:00",
    currentTemplateId: "tpl-1",
  },
  {
    displayId: "DSP-004",
    name: "Gambir Hall Center",
    locationId: "loc-3",
    type: "LED",
    resolution: "3840x2160",
    status: "online",
    lastSeen: "2026-01-10T14:30:00",
    currentTemplateId: "tpl-3",
  },
  {
    displayId: "DSP-005",
    name: "Bandung P1 Main",
    locationId: "loc-4",
    type: "LED",
    resolution: "1920x1080",
    status: "offline",
    lastSeen: "2026-01-10T10:15:00",
    currentTemplateId: "tpl-1",
  },
  {
    displayId: "DSP-006",
    name: "Bandung Waiting",
    locationId: "loc-5",
    type: "LCD",
    resolution: "1920x1080",
    status: "online",
    lastSeen: "2026-01-10T14:29:00",
    currentTemplateId: "tpl-2",
  },
  {
    displayId: "DSP-007",
    name: "Surabaya P1 Main",
    locationId: "loc-6",
    type: "LED",
    resolution: "1920x1080",
    status: "online",
    lastSeen: "2026-01-10T14:27:00",
    currentTemplateId: "tpl-1",
  },
  {
    displayId: "DSP-008",
    name: "Surabaya P2 Main",
    locationId: "loc-7",
    type: "LED",
    resolution: "1920x1080",
    status: "online",
    lastSeen: "2026-01-10T14:30:00",
    currentTemplateId: "tpl-1",
  },
  {
    displayId: "DSP-009",
    name: "Yogya Hall Main",
    locationId: "loc-8",
    type: "LED",
    resolution: "3840x2160",
    status: "online",
    lastSeen: "2026-01-10T14:26:00",
    currentTemplateId: "tpl-3",
  },
  {
    displayId: "DSP-010",
    name: "Yogya Hall Side",
    locationId: "loc-8",
    type: "LCD",
    resolution: "1280x720",
    status: "offline",
    lastSeen: "2026-01-09T22:00:00",
    currentTemplateId: null,
  },
]

export const trains: Train[] = [
  {
    trainNo: "KA-001",
    serviceName: "Argo Bromo Anggrek",
    origin: "Jakarta Gambir",
    destination: "Surabaya Gubeng",
    platform: "1",
    eta: "06:00",
    etd: "06:15",
    status: "On Time",
    lastUpdated: "2026-01-10T05:45:00",
  },
  {
    trainNo: "KA-002",
    serviceName: "Argo Parahyangan",
    origin: "Jakarta Gambir",
    destination: "Bandung",
    platform: "2",
    eta: "07:00",
    etd: "07:10",
    status: "On Time",
    lastUpdated: "2026-01-10T06:50:00",
  },
  {
    trainNo: "KA-003",
    serviceName: "Taksaka",
    origin: "Jakarta Gambir",
    destination: "Yogyakarta",
    platform: "1",
    eta: "08:00",
    etd: "08:15",
    status: "Delayed",
    lastUpdated: "2026-01-10T07:55:00",
  },
  {
    trainNo: "KA-004",
    serviceName: "Argo Wilis",
    origin: "Surabaya Gubeng",
    destination: "Bandung",
    platform: "3",
    eta: "09:30",
    etd: "09:45",
    status: "On Time",
    lastUpdated: "2026-01-10T09:20:00",
  },
  {
    trainNo: "KA-005",
    serviceName: "Gajayana",
    origin: "Jakarta Gambir",
    destination: "Malang",
    platform: "2",
    eta: "10:00",
    etd: "10:15",
    status: "Arrived",
    lastUpdated: "2026-01-10T10:00:00",
  },
  {
    trainNo: "KA-006",
    serviceName: "Argo Lawu",
    origin: "Jakarta Gambir",
    destination: "Solo Balapan",
    platform: "1",
    eta: "11:00",
    etd: "11:10",
    status: "On Time",
    lastUpdated: "2026-01-10T10:45:00",
  },
  {
    trainNo: "KA-007",
    serviceName: "Argo Dwipangga",
    origin: "Jakarta Gambir",
    destination: "Solo Balapan",
    platform: "2",
    eta: "12:30",
    etd: "12:45",
    status: "On Time",
    lastUpdated: "2026-01-10T12:15:00",
  },
  {
    trainNo: "KA-008",
    serviceName: "Bima",
    origin: "Jakarta Gambir",
    destination: "Surabaya Gubeng",
    platform: "3",
    eta: "14:00",
    etd: "14:15",
    status: "Cancelled",
    lastUpdated: "2026-01-10T13:00:00",
  },
  {
    trainNo: "KA-009",
    serviceName: "Argo Muria",
    origin: "Semarang Tawang",
    destination: "Jakarta Gambir",
    platform: "1",
    eta: "15:30",
    etd: "15:45",
    status: "On Time",
    lastUpdated: "2026-01-10T15:00:00",
  },
  {
    trainNo: "KA-010",
    serviceName: "Sembrani",
    origin: "Surabaya Gubeng",
    destination: "Jakarta Gambir",
    platform: "2",
    eta: "16:00",
    etd: "16:10",
    status: "On Time",
    lastUpdated: "2026-01-10T15:45:00",
  },
]

export const announcements: Announcement[] = [
  {
    id: "ann-1",
    title: "Night Maintenance Window",
    message: "Platform 3 display controllers will be patched between 22:00 and 05:00. Passenger traffic is redirected to adjacent screens.",
    priority: "medium",
    targetType: "location",
    targetIds: ["loc-1", "loc-2"],
    startAt: "2026-01-10T22:00:00",
    endAt: "2026-01-11T05:00:00",
    status: "scheduled",
    pinned: false,
    ticker: true,
  },
  {
    id: "ann-2",
    title: "Passenger Welcome Loop",
    message: "Welcome to the station. Please prepare your boarding pass and follow platform instructions shown on nearby displays.",
    priority: "low",
    targetType: "all",
    targetIds: [],
    startAt: "2026-01-01T00:00:00",
    endAt: "2026-12-31T23:59:59",
    status: "active",
    pinned: true,
    ticker: false,
  },
  {
    id: "ann-3",
    title: "Peak Travel Schedule",
    message: "Peak travel timetable is active from January 15 to January 20. Departure boards and hall displays will prioritize updated boarding information.",
    priority: "high",
    targetType: "all",
    targetIds: [],
    startAt: "2026-01-10T00:00:00",
    endAt: "2026-01-20T23:59:59",
    status: "active",
    pinned: true,
    ticker: true,
  },
  {
    id: "ann-4",
    title: "New Corridor Launch",
    message: "Direct corridor service to Cirebon becomes available on February 1. Promotional content has been scheduled for main hall displays.",
    priority: "medium",
    targetType: "location",
    targetIds: ["loc-3"],
    startAt: "2026-01-15T00:00:00",
    endAt: "2026-02-01T23:59:59",
    status: "scheduled",
    pinned: false,
    ticker: false,
  },
  {
    id: "ann-5",
    title: "Service Counter Hours",
    message: "Service counters operate daily from 04:00 to 22:00. Self-service kiosks remain available outside staffed hours.",
    priority: "low",
    targetType: "all",
    targetIds: [],
    startAt: "2026-01-01T00:00:00",
    endAt: "2026-12-31T23:59:59",
    status: "active",
    pinned: false,
    ticker: false,
  },
]

export const emergencies: Emergency[] = [
  {
    id: "emg-1",
    message: "Emergency drill broadcast for quarterly evacuation rehearsal",
    severity: "warning",
    targetType: "all",
    targetIds: [],
    startAt: "2026-01-05T10:00:00",
    endAt: "2026-01-05T10:15:00",
    active: false,
  },
  {
    id: "emg-2",
    message: "Temporary evacuation notice for Platform 2 pending field inspection",
    severity: "critical",
    targetType: "location",
    targetIds: ["loc-2"],
    startAt: "2026-01-08T14:30:00",
    endAt: "2026-01-08T15:00:00",
    active: false,
  },
]

export const templates: Template[] = [
  {
    templateId: "tpl-1",
    name: "Standard Platform",
    zones: ["header", "timetable", "ticker"],
    theme: "dark",
    lastEdited: "2026-01-05T10:00:00",
  },
  {
    templateId: "tpl-2",
    name: "Compact Info",
    zones: ["header", "body"],
    theme: "dark",
    lastEdited: "2026-01-03T15:30:00",
  },
  {
    templateId: "tpl-3",
    name: "Main Hall Large",
    zones: ["header", "left-panel", "right-panel", "ticker"],
    theme: "dark",
    lastEdited: "2026-01-08T09:00:00",
  },
  {
    templateId: "tpl-4",
    name: "Emergency Only",
    zones: ["full-screen"],
    theme: "red",
    lastEdited: "2026-01-02T12:00:00",
  },
  {
    templateId: "tpl-5",
    name: "Advertisement Split",
    zones: ["header", "content", "ad-banner", "ticker"],
    theme: "dark",
    lastEdited: "2026-01-07T14:00:00",
  },
]

export const media: Media[] = [
  {
    id: "med-1",
    fileName: "railops-brandmark.png",
    type: "image",
    size: "245 KB",
    tags: ["logo", "branding"],
    uploadedBy: "ops.admin@pids.local",
    uploadedAt: "2026-01-01T08:00:00",
    url: "/kai-railway-logo.jpg",
  },
  {
    id: "med-2",
    fileName: "safety-video.mp4",
    type: "video",
    size: "15.2 MB",
    tags: ["safety", "instruction"],
    uploadedBy: "ops.admin@pids.local",
    uploadedAt: "2026-01-02T10:00:00",
    url: "/safety-instruction-video-thumbnail.jpg",
  },
  {
    id: "med-3",
    fileName: "promo-banner.png",
    type: "image",
    size: "890 KB",
    tags: ["promotion", "banner"],
    uploadedBy: "content.operator@pids.local",
    uploadedAt: "2026-01-05T14:00:00",
    url: "/railway-promotional-banner.jpg",
  },
  {
    id: "med-4",
    fileName: "station-map.png",
    type: "image",
    size: "1.2 MB",
    tags: ["map", "navigation"],
    uploadedBy: "ops.admin@pids.local",
    uploadedAt: "2026-01-03T09:00:00",
    url: "/train-station-map-layout.jpg",
  },
  {
    id: "med-5",
    fileName: "holiday-promo.mp4",
    type: "video",
    size: "22.5 MB",
    tags: ["promotion", "holiday"],
    uploadedBy: "content.operator@pids.local",
    uploadedAt: "2026-01-08T11:00:00",
    url: "/holiday-travel-promotion-video.jpg",
  },
  {
    id: "med-6",
    fileName: "schedule-bg.png",
    type: "image",
    size: "456 KB",
    tags: ["background", "template"],
    uploadedBy: "ops.admin@pids.local",
    uploadedAt: "2026-01-04T16:00:00",
    url: "/train-schedule-background-dark.jpg",
  },
]

export const users: User[] = [
  { id: "usr-1", name: "Raka Pratama", email: "ops.admin@pids.local", role: "Admin", status: "active" },
  { id: "usr-2", name: "Nadia Putri", email: "station.ops@pids.local", role: "Operator", status: "active" },
  { id: "usr-3", name: "Farhan Akbar", email: "content.operator@pids.local", role: "Operator", status: "active" },
  { id: "usr-4", name: "Salsa Anindya", email: "viewer.audit@pids.local", role: "Viewer", status: "active" },
  { id: "usr-5", name: "Bagas Mahendra", email: "backup.operator@pids.local", role: "Operator", status: "inactive" },
]

export const auditLogs: AuditLog[] = [
  {
    id: "log-1",
    time: "2026-01-10T14:30:00",
    user: "ops.admin@pids.local",
    action: "UPDATE",
    entityType: "display",
    entityId: "DSP-001",
    result: "success",
  },
  {
    id: "log-2",
    time: "2026-01-10T14:15:00",
    user: "station.ops@pids.local",
    action: "CREATE",
    entityType: "announcement",
    entityId: "ann-3",
    result: "success",
  },
  {
    id: "log-3",
    time: "2026-01-10T13:45:00",
    user: "content.operator@pids.local",
    action: "UPDATE",
    entityType: "train",
    entityId: "KA-003",
    result: "success",
  },
  {
    id: "log-4",
    time: "2026-01-10T12:30:00",
    user: "ops.admin@pids.local",
    action: "DELETE",
    entityType: "media",
    entityId: "med-7",
    result: "success",
  },
  {
    id: "log-5",
    time: "2026-01-10T11:00:00",
    user: "station.ops@pids.local",
    action: "TRIGGER",
    entityType: "emergency",
    entityId: "emg-2",
    result: "success",
  },
  {
    id: "log-6",
    time: "2026-01-10T10:30:00",
    user: "content.operator@pids.local",
    action: "ASSIGN",
    entityType: "template",
    entityId: "tpl-1",
    result: "success",
  },
  {
    id: "log-7",
    time: "2026-01-10T09:15:00",
    user: "ops.admin@pids.local",
    action: "CREATE",
    entityType: "user",
    entityId: "usr-5",
    result: "success",
  },
  {
    id: "log-8",
    time: "2026-01-10T08:00:00",
    user: "system",
    action: "SYNC",
    entityType: "display",
    entityId: "all",
    result: "success",
  },
  {
    id: "log-9",
    time: "2026-01-09T23:00:00",
    user: "system",
    action: "BACKUP",
    entityType: "database",
    entityId: "main",
    result: "success",
  },
  {
    id: "log-10",
    time: "2026-01-09T18:30:00",
    user: "station.ops@pids.local",
    action: "UPDATE",
    entityType: "announcement",
    entityId: "ann-2",
    result: "failure",
  },
]

export const displayGroups: DisplayGroup[] = [
  {
    id: "grp-1",
    name: "Jakarta Gambir All",
    locationId: "loc-1",
    displayIds: ["DSP-001", "DSP-002", "DSP-003", "DSP-004"],
  },
  { id: "grp-2", name: "Bandung All", locationId: "loc-4", displayIds: ["DSP-005", "DSP-006"] },
  { id: "grp-3", name: "Surabaya All", locationId: "loc-6", displayIds: ["DSP-007", "DSP-008"] },
  { id: "grp-4", name: "Main Halls", locationId: "", displayIds: ["DSP-004", "DSP-009"] },
]

// Helper functions
export function getLocationById(id: string): Location | undefined {
  return locations.find((loc) => loc.id === id)
}

export function getTemplateById(id: string): Template | undefined {
  return templates.find((tpl) => tpl.templateId === id)
}

export function getDisplaysByLocation(locationId: string): Display[] {
  return displays.filter((d) => d.locationId === locationId)
}

export function getOnlineDisplaysCount(): number {
  return displays.filter((d) => d.status === "online").length
}

export function getActiveAnnouncementsCount(): number {
  return announcements.filter((a) => a.status === "active").length
}

export function getTodayTrainsCount(): number {
  return trains.length
}

export function getAlertsCount(): number {
  return displays.filter((d) => d.status === "offline").length + emergencies.filter((e) => e.active).length
}
