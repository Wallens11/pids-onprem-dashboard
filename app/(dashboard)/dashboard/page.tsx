"use client"

import { Header } from "@/components/dashboard/header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { DataTable } from "@/components/dashboard/data-table"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Monitor, Train, Megaphone, AlertTriangle, RefreshCw, Clock } from "lucide-react"
import {
  auditLogs,
  getOnlineDisplaysCount,
  getTodayTrainsCount,
  getActiveAnnouncementsCount,
  getAlertsCount,
  displays,
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
