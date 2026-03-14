import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type StatusType =
  | "online"
  | "offline"
  | "On Time"
  | "Delayed"
  | "Arrived"
  | "Cancelled"
  | "active"
  | "inactive"
  | "scheduled"
  | "expired"
  | "low"
  | "medium"
  | "high"
  | "warning"
  | "critical"
  | "success"
  | "failure"

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  online: { label: "Online", className: "bg-success/10 text-success border-success/20" },
  offline: { label: "Offline", className: "bg-destructive/10 text-destructive border-destructive/20" },
  "On Time": { label: "On Time", className: "bg-success/10 text-success border-success/20" },
  Delayed: { label: "Delayed", className: "bg-warning/10 text-warning border-warning/20" },
  Arrived: { label: "Arrived", className: "bg-primary/10 text-primary border-primary/20" },
  Cancelled: { label: "Cancelled", className: "bg-destructive/10 text-destructive border-destructive/20" },
  active: { label: "Active", className: "bg-success/10 text-success border-success/20" },
  inactive: { label: "Inactive", className: "bg-muted text-muted-foreground border-muted" },
  scheduled: { label: "Scheduled", className: "bg-primary/10 text-primary border-primary/20" },
  expired: { label: "Expired", className: "bg-muted text-muted-foreground border-muted" },
  low: { label: "Low", className: "bg-muted text-muted-foreground border-muted" },
  medium: { label: "Medium", className: "bg-warning/10 text-warning border-warning/20" },
  high: { label: "High", className: "bg-destructive/10 text-destructive border-destructive/20" },
  warning: { label: "Warning", className: "bg-warning/10 text-warning border-warning/20" },
  critical: { label: "Critical", className: "bg-destructive/10 text-destructive border-destructive/20" },
  success: { label: "Success", className: "bg-success/10 text-success border-success/20" },
  failure: { label: "Failed", className: "bg-destructive/10 text-destructive border-destructive/20" },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}
