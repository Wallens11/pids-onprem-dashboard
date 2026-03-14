"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { BreadcrumbNav } from "@/components/dashboard/breadcrumb-nav"
import { DataTable } from "@/components/dashboard/data-table"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { auditLogs, type AuditLog } from "@/lib/mock-data"
import { Search, Filter, Download, Calendar } from "lucide-react"
import { toast } from "sonner"

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState<string>("all")
  const [entityFilter, setEntityFilter] = useState<string>("all")
  const [resultFilter, setResultFilter] = useState<string>("all")

  // Get unique values for filters
  const uniqueActions = [...new Set(auditLogs.map((l) => l.action))]
  const uniqueEntities = [...new Set(auditLogs.map((l) => l.entityType))]

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesAction = actionFilter === "all" || log.action === actionFilter
    const matchesEntity = entityFilter === "all" || log.entityType === entityFilter
    const matchesResult = resultFilter === "all" || log.result === resultFilter
    return matchesSearch && matchesAction && matchesEntity && matchesResult
  })

  const handleExport = () => {
    toast.success("Audit logs exported to CSV")
  }

  const columns = [
    {
      key: "time",
      header: "Time",
      cell: (log: AuditLog) => (
        <div className="text-sm">
          <p>
            {new Date(log.time).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(log.time).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      ),
    },
    {
      key: "user",
      header: "User",
      cell: (log: AuditLog) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-medium text-primary">
              {log.user === "system" ? "S" : log.user.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-sm">{log.user.split("@")[0]}</span>
        </div>
      ),
    },
    {
      key: "action",
      header: "Action",
      cell: (log: AuditLog) => (
        <span
          className={`inline-block px-2 py-1 rounded text-xs font-mono font-medium ${
            log.action === "CREATE"
              ? "bg-success/10 text-success"
              : log.action === "DELETE"
                ? "bg-destructive/10 text-destructive"
                : log.action === "UPDATE"
                  ? "bg-warning/10 text-warning"
                  : log.action === "TRIGGER"
                    ? "bg-destructive/10 text-destructive"
                    : "bg-muted text-muted-foreground"
          }`}
        >
          {log.action}
        </span>
      ),
    },
    {
      key: "entity",
      header: "Entity",
      cell: (log: AuditLog) => (
        <div className="text-sm">
          <p className="capitalize">{log.entityType}</p>
          <p className="text-xs text-muted-foreground font-mono">{log.entityId}</p>
        </div>
      ),
    },
    {
      key: "result",
      header: "Result",
      cell: (log: AuditLog) => <StatusBadge status={log.result} />,
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <Header title="Audit Logs" subtitle="Track all system activities and changes" />

      <div className="flex-1 p-6 space-y-6">
        <BreadcrumbNav items={[{ label: "Audit Logs" }]} />

        {/* Filters */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by user or entity..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-secondary border-0"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />

                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger className="w-[130px] bg-secondary border-0">
                    <SelectValue placeholder="Action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    {uniqueActions.map((action) => (
                      <SelectItem key={action} value={action}>
                        {action}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={entityFilter} onValueChange={setEntityFilter}>
                  <SelectTrigger className="w-[130px] bg-secondary border-0">
                    <SelectValue placeholder="Entity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Entities</SelectItem>
                    {uniqueEntities.map((entity) => (
                      <SelectItem key={entity} value={entity} className="capitalize">
                        {entity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={resultFilter} onValueChange={setResultFilter}>
                  <SelectTrigger className="w-[120px] bg-secondary border-0">
                    <SelectValue placeholder="Result" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Results</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="failure">Failed</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="icon" className="bg-transparent">
                  <Calendar className="w-4 h-4" />
                </Button>
              </div>

              <Button variant="outline" onClick={handleExport} className="ml-auto bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Logs Table */}
        <DataTable columns={columns} data={filteredLogs} pageSize={15} emptyMessage="No audit logs found" />
      </div>
    </div>
  )
}
