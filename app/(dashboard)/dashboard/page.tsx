"use client"

import { Header } from "@/components/dashboard/header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { DataTable } from "@/components/dashboard/data-table"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Monitor, Train, Megaphone, AlertTriangle, RefreshCw, Clock, Siren, WifiOff } from "lucide-react"
import {
  auditLogs,
  announcements,
  emergencies,
  getOnlineDisplaysCount,
  getTodayTrainsCount,
  getActiveAnnouncementsCount,
  getAlertsCount,
  displays,
  trains,
} from "@/lib/mock-data"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

const contentUpdatesData = [
  { day: "Mon", updates: 12 },
  { day: "Tue", updates: 19 },
  { day: "Wed", updates: 8 },
  { day: "Thu", updates: 15 },
  { day: "Fri", updates: 22 },
  { day: "Sat", updates: 6 },
  { day: "Sun", updates: 4 },
]

const emergencyData = [
  { month: "Oct", count: 1 },
  { month: "Nov", count: 0 },
  { month: "Dec", count: 2 },
  { month: "Jan", count: 1 },
]

const recentActivityColumns = [
  {
    key: "time",
    header: "Time",
    cell: (log: (typeof auditLogs)[0]) => (
      <span className="text-muted-foreground">
        {new Date(log.time).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    ),
  },
  {
    key: "user",
    header: "User",
    cell: (log: (typeof auditLogs)[0]) => log.user.split("@")[0],
  },
  {
    key: "action",
    header: "Action",
    cell: (log: (typeof auditLogs)[0]) => (
      <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{log.action}</span>
    ),
  },
  {
    key: "entity",
    header: "Entity",
    cell: (log: (typeof auditLogs)[0]) => (
      <span className="text-muted-foreground">
        {log.entityType}/{log.entityId}
      </span>
    ),
  },
  {
    key: "result",
    header: "Result",
    cell: (log: (typeof auditLogs)[0]) => <StatusBadge status={log.result} />,
  },
]

export default function OverviewPage() {
  const onlineDisplays = getOnlineDisplaysCount()
  const totalDisplays = displays.length
  const todayTrains = getTodayTrainsCount()
  const activeAnnouncements = getActiveAnnouncementsCount()
  const alerts = getAlertsCount()
  const offlineDisplays = displays.filter((display) => display.status === "offline")
  const delayedServices = trains.filter((train) => train.status === "Delayed" || train.status === "Cancelled")
  const activeEmergency = emergencies.find((emergency) => emergency.active)
  const pinnedAnnouncements = announcements.filter((announcement) => announcement.pinned).slice(0, 2)

  return (
    <div className="flex flex-col h-full">
      <Header title="Operations Overview" subtitle="Monitor station displays, schedules, and broadcast activity from one control surface" />

      <div className="flex-1 p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatsCard
            title="Active Displays"
            value={`${onlineDisplays}/${totalDisplays}`}
            subtitle="Online / Total"
            icon={Monitor}
            variant="success"
          />
          <StatsCard title="Scheduled Trains" value={todayTrains} subtitle="Today" icon={Train} variant="default" />
          <StatsCard
            title="Active Announcements"
            value={activeAnnouncements}
            subtitle="Currently running"
            icon={Megaphone}
            variant="default"
          />
          <StatsCard title="Last Sync" value="2 min" subtitle="ago" icon={RefreshCw} variant="default" />
          <StatsCard
            title="Alerts"
            value={alerts}
            subtitle={alerts > 0 ? "Needs attention" : "All clear"}
            icon={AlertTriangle}
            variant={alerts > 0 ? "warning" : "success"}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base font-medium">Content Updates per Day</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={contentUpdatesData}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} className="text-xs" />
                    <YAxis axisLine={false} tickLine={false} className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="updates" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base font-medium">Emergency Broadcasts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={emergencyData}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} className="text-xs" />
                    <YAxis axisLine={false} tickLine={false} className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.7fr] gap-6">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-medium">Operational Watchlist</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="w-4 h-4" />
                <span>{alerts} active items</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <WifiOff className="w-4 h-4 text-warning" />
                  <h3 className="font-medium">Offline Displays</h3>
                </div>
                <div className="space-y-3">
                  {offlineDisplays.length > 0 ? (
                    offlineDisplays.map((display) => (
                      <div key={display.displayId} className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-medium">{display.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {display.displayId} · Last seen{" "}
                            {new Date(display.lastSeen).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <StatusBadge status="offline" />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No offline displays in the current snapshot.</p>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Train className="w-4 h-4 text-primary" />
                  <h3 className="font-medium">Service Exceptions</h3>
                </div>
                <div className="space-y-3">
                  {delayedServices.length > 0 ? (
                    delayedServices.map((train) => (
                      <div key={train.trainNo} className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-medium">
                            {train.trainNo} · {train.serviceName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Platform {train.platform} · {train.origin} {"->"} {train.destination}
                          </p>
                        </div>
                        <StatusBadge status={train.status} />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No delayed or cancelled services right now.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base font-medium">Broadcast Readiness</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Siren className="w-4 h-4 text-destructive" />
                    <span className="font-medium">Emergency Channel</span>
                  </div>
                  <StatusBadge status={activeEmergency ? "critical" : "success"} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {activeEmergency
                    ? activeEmergency.message
                    : "No active emergency override. Broadcast channel is ready for drill or live incident use."}
                </p>
              </div>

              <div className="rounded-xl border border-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-primary" />
                    <span className="font-medium">Pinned Announcements</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{pinnedAnnouncements.length} queued</span>
                </div>
                <div className="space-y-3">
                  {pinnedAnnouncements.map((announcement) => (
                    <div key={announcement.id} className="rounded-lg bg-muted/40 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-sm">{announcement.title}</p>
                        <StatusBadge status={announcement.priority} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{announcement.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Last 24 hours</span>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable columns={recentActivityColumns} data={auditLogs.slice(0, 8)} pageSize={8} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
