"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/dashboard/header"
import { BreadcrumbNav } from "@/components/dashboard/breadcrumb-nav"
import { DataTable } from "@/components/dashboard/data-table"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { emergencies, locations, displayGroups, type Emergency } from "@/lib/mock-data"
import { AlertTriangle, AlertOctagon, Radio, Square, Clock, Users } from "lucide-react"
import { toast } from "sonner"

export default function EmergencyPage() {
  const [triggerDialogOpen, setTriggerDialogOpen] = useState(false)
  const [activeEmergency, setActiveEmergency] = useState<Emergency | null>(null)
  const [countdown, setCountdown] = useState(0)
  const [formData, setFormData] = useState({
    message: "",
    severity: "warning" as "warning" | "critical",
    targetType: "all" as "all" | "location" | "group",
    targetIds: [] as string[],
    duration: 15,
    requireAcknowledgement: false,
  })

  // Simulate countdown for active emergency
  useEffect(() => {
    if (activeEmergency && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && activeEmergency) {
      setActiveEmergency(null)
      toast.info("Emergency broadcast ended")
    }
  }, [countdown, activeEmergency])

  const handleTrigger = () => {
    const newEmergency: Emergency = {
      id: `emg-${Date.now()}`,
      message: formData.message,
      severity: formData.severity,
      targetType: formData.targetType,
      targetIds: formData.targetIds,
      startAt: new Date().toISOString(),
      endAt: null,
      active: true,
    }
    setActiveEmergency(newEmergency)
    setCountdown(formData.duration * 60)
    setTriggerDialogOpen(false)
    toast.success("Emergency broadcast triggered", {
      description: "All targeted displays are now showing the emergency message",
    })
  }

  const handleStop = () => {
    setActiveEmergency(null)
    setCountdown(0)
    toast.info("Emergency broadcast stopped")
  }

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const historyColumns = [
    {
      key: "time",
      header: "Time",
      cell: (emg: Emergency) => (
        <span className="text-sm">
          {new Date(emg.startAt).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
    {
      key: "message",
      header: "Message",
      cell: (emg: Emergency) => <span className="truncate max-w-[300px] block">{emg.message}</span>,
    },
    {
      key: "severity",
      header: "Severity",
      cell: (emg: Emergency) => <StatusBadge status={emg.severity} />,
    },
    {
      key: "target",
      header: "Target",
      cell: (emg: Emergency) => (
        <span className="text-sm text-muted-foreground">
          {emg.targetType === "all" ? "All Displays" : `${emg.targetIds.length} ${emg.targetType}(s)`}
        </span>
      ),
    },
    {
      key: "duration",
      header: "Duration",
      cell: (emg: Emergency) => {
        if (emg.endAt) {
          const start = new Date(emg.startAt).getTime()
          const end = new Date(emg.endAt).getTime()
          const mins = Math.round((end - start) / 60000)
          return <span className="text-sm text-muted-foreground">{mins} min</span>
        }
        return <span className="text-sm text-muted-foreground">-</span>
      },
    },
    {
      key: "status",
      header: "Status",
      cell: (emg: Emergency) => (emg.active ? <StatusBadge status="active" /> : <StatusBadge status="expired" />),
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <Header title="Emergency Broadcast" subtitle="Trigger emergency messages to all displays" />

      <div className="flex-1 p-6 space-y-6">
        <BreadcrumbNav items={[{ label: "Emergency Broadcast" }]} />

        {/* Active Emergency Banner */}
        {activeEmergency && (
          <Alert
            variant="destructive"
            className={`${
              activeEmergency.severity === "critical"
                ? "bg-destructive/20 border-destructive"
                : "bg-warning/20 border-warning"
            }`}
          >
            <Radio className="h-5 w-5 animate-pulse" />
            <AlertTitle className="text-lg font-bold flex items-center gap-4">
              EMERGENCY BROADCAST ACTIVE
              <span className="font-mono text-xl bg-background/50 px-3 py-1 rounded">{formatCountdown(countdown)}</span>
            </AlertTitle>
            <AlertDescription className="mt-2">
              <p className="mb-4">{activeEmergency.message}</p>
              <div className="flex items-center gap-4">
                <span className="text-sm flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Target:{" "}
                  {activeEmergency.targetType === "all"
                    ? "All Displays"
                    : `${activeEmergency.targetIds.length} locations`}
                </span>
                <Button variant="outline" size="sm" onClick={handleStop} className="bg-background/50">
                  <Square className="w-4 h-4 mr-2" />
                  Stop Broadcast
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Trigger Button */}
        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center">
            <div className="max-w-md mx-auto space-y-6">
              <div
                className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
                  activeEmergency ? "bg-destructive/20" : "bg-destructive/10"
                }`}
              >
                {activeEmergency ? (
                  <Radio className="w-12 h-12 text-destructive animate-pulse" />
                ) : (
                  <AlertOctagon className="w-12 h-12 text-destructive" />
                )}
              </div>

              <div>
                <h2 className="text-xl font-bold mb-2">Emergency Broadcast System</h2>
                <p className="text-muted-foreground">
                  Trigger an emergency message that will immediately display on all targeted screens. Use this for
                  critical safety announcements only.
                </p>
              </div>

              <Button
                size="lg"
                variant="destructive"
                className="w-full h-14 text-lg font-bold"
                onClick={() => setTriggerDialogOpen(true)}
                disabled={!!activeEmergency}
              >
                <AlertTriangle className="w-5 h-5 mr-2" />
                {activeEmergency ? "Broadcast Active" : "Trigger Emergency Message"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Emergency History */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Emergency Broadcast History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={historyColumns}
              data={emergencies}
              pageSize={5}
              emptyMessage="No emergency broadcasts in history"
            />
          </CardContent>
        </Card>
      </div>

      {/* Trigger Emergency Dialog */}
      <Dialog open={triggerDialogOpen} onOpenChange={setTriggerDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Trigger Emergency Broadcast
            </DialogTitle>
            <DialogDescription>
              This will immediately display an emergency message on targeted screens.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Emergency Message</Label>
              <Textarea
                placeholder="Enter emergency message..."
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Severity</Label>
                <Select
                  value={formData.severity}
                  onValueChange={(v) => setFormData({ ...formData, severity: v as "warning" | "critical" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warning">
                      <span className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-warning" />
                        Warning
                      </span>
                    </SelectItem>
                    <SelectItem value="critical">
                      <span className="flex items-center gap-2">
                        <AlertOctagon className="w-4 h-4 text-destructive" />
                        Critical
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Duration (minutes)</Label>
                <Select
                  value={formData.duration.toString()}
                  onValueChange={(v) => setFormData({ ...formData, duration: Number.parseInt(v) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Target</Label>
              <Select
                value={formData.targetType}
                onValueChange={(v) => setFormData({ ...formData, targetType: v as "all" | "location" | "group" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Displays</SelectItem>
                  <SelectItem value="location">Specific Locations</SelectItem>
                  <SelectItem value="group">Display Groups</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.targetType === "location" && (
              <div className="space-y-2">
                <Label>Select Locations</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose locations..." />
                  </SelectTrigger>
                  <SelectContent>
                    {[...new Set(locations.map((l) => l.stationName))].map((station) => (
                      <SelectItem key={station} value={station}>
                        {station}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.targetType === "group" && (
              <div className="space-y-2">
                <Label>Select Display Groups</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose groups..." />
                  </SelectTrigger>
                  <SelectContent>
                    {displayGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <Switch
                id="ack"
                checked={formData.requireAcknowledgement}
                onCheckedChange={(c) => setFormData({ ...formData, requireAcknowledgement: c })}
              />
              <Label htmlFor="ack" className="cursor-pointer">
                Require acknowledgement from operators
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTriggerDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleTrigger} disabled={!formData.message.trim()}>
              <AlertTriangle className="w-4 h-4 mr-2" />
              Trigger Broadcast
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
