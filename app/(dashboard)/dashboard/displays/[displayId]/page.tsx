"use client"

import { use } from "react"
import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { BreadcrumbNav } from "@/components/dashboard/breadcrumb-nav"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { DataTable } from "@/components/dashboard/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { displays, announcements, auditLogs, getLocationById, getTemplateById } from "@/lib/mock-data"
import {
  Monitor,
  MapPin,
  Layout,
  Clock,
  Wifi,
  WifiOff,
  Edit,
  Send,
  RotateCcw,
  Power,
  Thermometer,
  HardDrive,
  Cpu,
  Calendar,
} from "lucide-react"
import { toast } from "sonner"

export default function DisplayDetailPage({ params }: { params: Promise<{ displayId: string }> }) {
  const { displayId } = use(params)
  const [activeTab, setActiveTab] = useState("content")

  const display = displays.find((d) => d.displayId === displayId)
  const location = display ? getLocationById(display.locationId) : null
  const template = display?.currentTemplateId ? getTemplateById(display.currentTemplateId) : null

  if (!display) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Display Not Found" />
        <div className="flex-1 p-6">
          <p className="text-muted-foreground">The requested display could not be found.</p>
        </div>
      </div>
    )
  }

  const assignedAnnouncements = announcements.filter(
    (a) => a.targetType === "all" || a.targetIds.includes(display.locationId),
  )

  const displayLogs = auditLogs.filter((log) => log.entityType === "display" && log.entityId === display.displayId)

  const handleAction = (action: string) => {
    toast.success(`${action} action triggered for ${display.displayId}`)
  }

  const contentColumns = [
    {
      key: "title",
      header: "Content",
      cell: (item: (typeof assignedAnnouncements)[0]) => (
        <div>
          <p className="font-medium">{item.title}</p>
          <p className="text-xs text-muted-foreground truncate max-w-[300px]">{item.message}</p>
        </div>
      ),
    },
    {
      key: "priority",
      header: "Priority",
      cell: (item: (typeof assignedAnnouncements)[0]) => <StatusBadge status={item.priority} />,
    },
    {
      key: "status",
      header: "Status",
      cell: (item: (typeof assignedAnnouncements)[0]) => <StatusBadge status={item.status} />,
    },
    {
      key: "schedule",
      header: "Schedule",
      cell: (item: (typeof assignedAnnouncements)[0]) => (
        <span className="text-sm text-muted-foreground">
          {new Date(item.startAt).toLocaleDateString()} - {new Date(item.endAt).toLocaleDateString()}
        </span>
      ),
    },
  ]

  const logsColumns = [
    {
      key: "time",
      header: "Time",
      cell: (log: (typeof auditLogs)[0]) => (
        <span className="text-sm text-muted-foreground">
          {new Date(log.time).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
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
      key: "result",
      header: "Result",
      cell: (log: (typeof auditLogs)[0]) => <StatusBadge status={log.result} />,
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <Header title={display.name} subtitle={`Display ID: ${display.displayId}`} />

      <div className="flex-1 p-6 space-y-6">
        <BreadcrumbNav items={[{ label: "Displays", href: "/dashboard/displays" }, { label: display.name }]} />

        {/* Info Panel & Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-medium">Display Information</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleAction("Edit")}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleAction("Push Content")}>
                  <Send className="w-4 h-4 mr-2" />
                  Push
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleAction("Restart")}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Restart
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive bg-transparent"
                  onClick={() => handleAction("Disable")}
                >
                  <Power className="w-4 h-4 mr-2" />
                  Disable
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Monitor className="w-3 h-3" />
                    Type
                  </p>
                  <p className="font-medium">{display.type}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Resolution</p>
                  <p className="font-medium">{display.resolution}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Location
                  </p>
                  <p className="font-medium">{location?.stationName}</p>
                  <p className="text-xs text-muted-foreground">{location?.areaName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Layout className="w-3 h-3" />
                    Template
                  </p>
                  <p className="font-medium">{template?.name || "Not assigned"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    {display.status === "online" ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                    Status
                  </p>
                  <StatusBadge status={display.status} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Last Seen
                  </p>
                  <p className="font-medium">
                    {new Date(display.lastSeen).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base font-medium">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Uptime (7d)</span>
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                  99.2%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Content Syncs</span>
                <span className="text-sm font-medium">156</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Errors (24h)</span>
                <span className="text-sm font-medium">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Assigned Content</span>
                <span className="text-sm font-medium">{assignedAnnouncements.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-muted">
            <TabsTrigger value="content">Assigned Content</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="health">Device Health</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="mt-6">
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <DataTable
                  columns={contentColumns}
                  data={assignedAnnouncements}
                  pageSize={5}
                  emptyMessage="No content assigned to this display"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="mt-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Display Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">Operating Hours</p>
                      <p className="text-sm text-muted-foreground">Daily schedule</p>
                    </div>
                    <p className="font-mono">04:00 - 00:00</p>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">Content Rotation</p>
                      <p className="text-sm text-muted-foreground">Interval between content</p>
                    </div>
                    <p className="font-mono">30 seconds</p>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">Sync Frequency</p>
                      <p className="text-sm text-muted-foreground">Content update check</p>
                    </div>
                    <p className="font-mono">Every 5 min</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-success/10">
                      <Thermometer className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Temperature</p>
                      <p className="text-2xl font-bold">42°C</p>
                      <p className="text-xs text-success">Normal</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <HardDrive className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Storage</p>
                      <p className="text-2xl font-bold">68%</p>
                      <p className="text-xs text-muted-foreground">12.4 GB free</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-success/10">
                      <Cpu className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">CPU Usage</p>
                      <p className="text-2xl font-bold">23%</p>
                      <p className="text-xs text-success">Low</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="mt-6">
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <DataTable
                  columns={logsColumns}
                  data={displayLogs.length > 0 ? displayLogs : auditLogs.slice(0, 5)}
                  pageSize={10}
                  emptyMessage="No logs found for this display"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
