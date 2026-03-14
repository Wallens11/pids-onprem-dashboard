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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { displays, locations, templates, getLocationById, getTemplateById, type Display } from "@/lib/mock-data"
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Layout,
  Send,
  RotateCcw,
  Power,
  Plus,
  Monitor,
  CheckSquare,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function DisplaysPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [locationFilter, setLocationFilter] = useState<string>("all")
  const [selectedDisplays, setSelectedDisplays] = useState<string[]>([])
  const [assignTemplateOpen, setAssignTemplateOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingDisplay, setEditingDisplay] = useState<Display | null>(null)
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false)

  // Filter displays
  const filteredDisplays = displays.filter((display) => {
    const matchesSearch =
      display.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      display.displayId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || display.status === statusFilter
    const matchesType = typeFilter === "all" || display.type === typeFilter
    const matchesLocation = locationFilter === "all" || display.locationId === locationFilter
    return matchesSearch && matchesStatus && matchesType && matchesLocation
  })

  // Get unique stations for filter
  const uniqueStations = [...new Set(locations.map((l) => l.stationName))]

  const toggleDisplaySelection = (displayId: string) => {
    setSelectedDisplays((prev) =>
      prev.includes(displayId) ? prev.filter((id) => id !== displayId) : [...prev, displayId],
    )
  }

  const toggleAllDisplays = () => {
    if (selectedDisplays.length === filteredDisplays.length) {
      setSelectedDisplays([])
    } else {
      setSelectedDisplays(filteredDisplays.map((d) => d.displayId))
    }
  }

  const handleAction = (action: string, displayId: string) => {
    toast.success(`${action} action triggered for ${displayId}`)
  }

  const handleBulkAssign = (templateId: string) => {
    toast.success(`Template assigned to ${selectedDisplays.length} displays`)
    setSelectedDisplays([])
    setBulkAssignOpen(false)
  }

  const columns = [
    {
      key: "select",
      header: (
        <Checkbox
          checked={selectedDisplays.length === filteredDisplays.length && filteredDisplays.length > 0}
          onCheckedChange={toggleAllDisplays}
        />
      ),
      cell: (display: Display) => (
        <Checkbox
          checked={selectedDisplays.includes(display.displayId)}
          onCheckedChange={() => toggleDisplaySelection(display.displayId)}
          onClick={(e) => e.stopPropagation()}
        />
      ),
      className: "w-12",
    },
    {
      key: "displayId",
      header: "Display ID",
      cell: (display: Display) => <span className="font-mono text-sm">{display.displayId}</span>,
    },
    {
      key: "name",
      header: "Name",
      cell: (display: Display) => (
        <div>
          <p className="font-medium">{display.name}</p>
          <p className="text-xs text-muted-foreground">
            {getLocationById(display.locationId)?.stationName} - {getLocationById(display.locationId)?.areaName}
          </p>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      cell: (display: Display) => (
        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">
          <Monitor className="w-3 h-3" />
          {display.type}
        </span>
      ),
    },
    {
      key: "resolution",
      header: "Resolution",
      cell: (display: Display) => <span className="text-muted-foreground">{display.resolution}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (display: Display) => <StatusBadge status={display.status} />,
    },
    {
      key: "template",
      header: "Template",
      cell: (display: Display) => (
        <span className="text-muted-foreground">
          {display.currentTemplateId ? getTemplateById(display.currentTemplateId)?.name : "Not assigned"}
        </span>
      ),
    },
    {
      key: "lastSeen",
      header: "Last Seen",
      cell: (display: Display) => (
        <span className="text-muted-foreground text-sm">
          {new Date(display.lastSeen).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (display: Display) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/displays/${display.displayId}`}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setEditingDisplay(display)
                setEditDialogOpen(true)
              }}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAssignTemplateOpen(true)}>
              <Layout className="w-4 h-4 mr-2" />
              Assign Template
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction("Push Content", display.displayId)}>
              <Send className="w-4 h-4 mr-2" />
              Push Content
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleAction("Restart", display.displayId)}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Restart
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleAction("Disable", display.displayId)}
              className="text-destructive focus:text-destructive"
            >
              <Power className="w-4 h-4 mr-2" />
              Disable
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: "w-12",
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <Header title="Displays" subtitle="Manage and monitor all display screens" />

      <div className="flex-1 p-6 space-y-6">
        <BreadcrumbNav items={[{ label: "Displays" }]} />

        {/* Filters and Actions */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search displays..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-secondary border-0"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px] bg-secondary border-0">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[120px] bg-secondary border-0">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="LED">LED</SelectItem>
                    <SelectItem value="LCD">LCD</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="w-[160px] bg-secondary border-0">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {uniqueStations.map((station) => (
                      <SelectItem key={station} value={locations.find((l) => l.stationName === station)?.id || ""}>
                        {station}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                {selectedDisplays.length > 0 && (
                  <Button variant="outline" onClick={() => setBulkAssignOpen(true)}>
                    <CheckSquare className="w-4 h-4 mr-2" />
                    Bulk Assign ({selectedDisplays.length})
                  </Button>
                )}
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Display
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Displays Table */}
        <DataTable
          columns={columns}
          data={filteredDisplays}
          pageSize={10}
          emptyMessage="No displays found matching your criteria"
          onRowClick={(display) => {
            window.location.href = `/dashboard/displays/${display.displayId}`
          }}
        />
      </div>

      {/* Edit Display Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Display</DialogTitle>
            <DialogDescription>Update display information</DialogDescription>
          </DialogHeader>
          {editingDisplay && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Display ID</Label>
                <Input value={editingDisplay.displayId} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input defaultValue={editingDisplay.name} />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Select defaultValue={editingDisplay.locationId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id}>
                        {loc.stationName} - {loc.areaName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select defaultValue={editingDisplay.type}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LED">LED</SelectItem>
                      <SelectItem value="LCD">LCD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Resolution</Label>
                  <Input defaultValue={editingDisplay.resolution} />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success("Display updated successfully")
                setEditDialogOpen(false)
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Template Dialog */}
      <Dialog open={assignTemplateOpen} onOpenChange={setAssignTemplateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Template</DialogTitle>
            <DialogDescription>Select a template to assign to this display</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Template</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((tpl) => (
                    <SelectItem key={tpl.templateId} value={tpl.templateId}>
                      {tpl.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignTemplateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success("Template assigned successfully")
                setAssignTemplateOpen(false)
              }}
            >
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Assign Dialog */}
      <Dialog open={bulkAssignOpen} onOpenChange={setBulkAssignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Assign Template</DialogTitle>
            <DialogDescription>Assign template to {selectedDisplays.length} selected displays</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Template</Label>
              <Select onValueChange={handleBulkAssign}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((tpl) => (
                    <SelectItem key={tpl.templateId} value={tpl.templateId}>
                      {tpl.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">Selected displays: {selectedDisplays.join(", ")}</div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkAssignOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
