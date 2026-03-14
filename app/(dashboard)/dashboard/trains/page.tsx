"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { BreadcrumbNav } from "@/components/dashboard/breadcrumb-nav"
import { DataTable } from "@/components/dashboard/data-table"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { trains, type Train } from "@/lib/mock-data"
import {
  Search,
  Filter,
  Plus,
  Upload,
  Send,
  MoreHorizontal,
  Edit,
  Trash2,
  FileSpreadsheet,
  Calendar,
} from "lucide-react"
import { toast } from "sonner"

export default function TrainsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("timetable")
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [publishDialogOpen, setPublishDialogOpen] = useState(false)
  const [editingTrain, setEditingTrain] = useState<Train | null>(null)
  const [importPreview, setImportPreview] = useState<boolean>(false)

  // Filter trains
  const filteredTrains = trains.filter((train) => {
    const matchesSearch =
      train.trainNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      train.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      train.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      train.destination.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || train.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleDelete = (trainNo: string) => {
    toast.success(`Train ${trainNo} deleted`)
  }

  const columns = [
    {
      key: "trainNo",
      header: "Train No",
      cell: (train: Train) => <span className="font-mono font-medium">{train.trainNo}</span>,
    },
    {
      key: "service",
      header: "Service",
      cell: (train: Train) => (
        <div>
          <p className="font-medium">{train.serviceName}</p>
        </div>
      ),
    },
    {
      key: "route",
      header: "Route",
      cell: (train: Train) => (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">{train.origin}</span>
          <span className="text-muted-foreground">-&gt;</span>
          <span>{train.destination}</span>
        </div>
      ),
    },
    {
      key: "platform",
      header: "Platform",
      cell: (train: Train) => (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold">
          {train.platform}
        </span>
      ),
    },
    {
      key: "eta",
      header: "ETA",
      cell: (train: Train) => <span className="font-mono">{train.eta}</span>,
    },
    {
      key: "etd",
      header: "ETD",
      cell: (train: Train) => <span className="font-mono">{train.etd}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (train: Train) => <StatusBadge status={train.status} />,
    },
    {
      key: "lastUpdated",
      header: "Last Updated",
      cell: (train: Train) => (
        <span className="text-sm text-muted-foreground">
          {new Date(train.lastUpdated).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (train: Train) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setEditingTrain(train)
                setEditDialogOpen(true)
              }}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(train.trainNo)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: "w-12",
    },
  ]

  // Mock CSV preview data
  const csvPreviewData = [
    {
      trainNo: "KA-011",
      serviceName: "Argo Sindoro",
      origin: "Semarang",
      destination: "Jakarta",
      platform: "1",
      eta: "17:00",
      etd: "17:15",
    },
    {
      trainNo: "KA-012",
      serviceName: "Mutiara Selatan",
      origin: "Surabaya",
      destination: "Bandung",
      platform: "2",
      eta: "18:30",
      etd: "18:45",
    },
    {
      trainNo: "KA-013",
      serviceName: "Lodaya",
      origin: "Bandung",
      destination: "Solo",
      platform: "3",
      eta: "19:00",
      etd: "19:15",
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <Header title="Trains / Timetable" subtitle="Manage train schedules and timetable" />

      <div className="flex-1 p-6 space-y-6">
        <BreadcrumbNav items={[{ label: "Trains / Timetable" }]} />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList className="bg-muted">
              <TabsTrigger value="timetable">Timetable</TabsTrigger>
              <TabsTrigger value="import">Import</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setPublishDialogOpen(true)}>
                <Send className="w-4 h-4 mr-2" />
                Publish Schedule
              </Button>
              <Button onClick={() => setAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Train
              </Button>
            </div>
          </div>

          <TabsContent value="timetable" className="mt-6 space-y-4">
            {/* Filters */}
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search trains..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 bg-secondary border-0"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[150px] bg-secondary border-0">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="On Time">On Time</SelectItem>
                        <SelectItem value="Delayed">Delayed</SelectItem>
                        <SelectItem value="Arrived">Arrived</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trains Table */}
            <DataTable columns={columns} data={filteredTrains} pageSize={10} emptyMessage="No trains found" />
          </TabsContent>

          <TabsContent value="import" className="mt-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Import Timetable from CSV
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div
                  className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => setImportDialogOpen(true)}
                >
                  <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">Drop CSV file here or click to upload</p>
                  <p className="text-sm text-muted-foreground">
                    Supports CSV files with columns: trainNo, serviceName, origin, destination, platform, eta, etd
                  </p>
                </div>

                {importPreview && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Preview (3 rows)</h3>
                      <Button
                        onClick={() => {
                          toast.success("Timetable imported successfully")
                          setImportPreview(false)
                        }}
                      >
                        Import All Rows
                      </Button>
                    </div>
                    <div className="rounded-lg border border-border overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted">
                          <tr>
                            <th className="px-4 py-2 text-left">Train No</th>
                            <th className="px-4 py-2 text-left">Service</th>
                            <th className="px-4 py-2 text-left">Origin</th>
                            <th className="px-4 py-2 text-left">Destination</th>
                            <th className="px-4 py-2 text-left">Platform</th>
                            <th className="px-4 py-2 text-left">ETA</th>
                            <th className="px-4 py-2 text-left">ETD</th>
                          </tr>
                        </thead>
                        <tbody>
                          {csvPreviewData.map((row, i) => (
                            <tr key={i} className="border-t border-border">
                              <td className="px-4 py-2 font-mono">{row.trainNo}</td>
                              <td className="px-4 py-2">{row.serviceName}</td>
                              <td className="px-4 py-2">{row.origin}</td>
                              <td className="px-4 py-2">{row.destination}</td>
                              <td className="px-4 py-2">{row.platform}</td>
                              <td className="px-4 py-2 font-mono">{row.eta}</td>
                              <td className="px-4 py-2 font-mono">{row.etd}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Train Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Train</DialogTitle>
            <DialogDescription>Enter train schedule details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Train No</Label>
                <Input placeholder="KA-XXX" />
              </div>
              <div className="space-y-2">
                <Label>Platform</Label>
                <Input placeholder="1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Service Name</Label>
              <Input placeholder="e.g. Argo Bromo" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Origin</Label>
                <Input placeholder="Jakarta Gambir" />
              </div>
              <div className="space-y-2">
                <Label>Destination</Label>
                <Input placeholder="Surabaya Gubeng" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ETA</Label>
                <Input type="time" />
              </div>
              <div className="space-y-2">
                <Label>ETD</Label>
                <Input type="time" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select defaultValue="On Time">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="On Time">On Time</SelectItem>
                  <SelectItem value="Delayed">Delayed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success("Train added successfully")
                setAddDialogOpen(false)
              }}
            >
              Add Train
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Train Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Train</DialogTitle>
            <DialogDescription>Update train schedule details</DialogDescription>
          </DialogHeader>
          {editingTrain && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Train No</Label>
                  <Input defaultValue={editingTrain.trainNo} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Platform</Label>
                  <Input defaultValue={editingTrain.platform} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Service Name</Label>
                <Input defaultValue={editingTrain.serviceName} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Origin</Label>
                  <Input defaultValue={editingTrain.origin} />
                </div>
                <div className="space-y-2">
                  <Label>Destination</Label>
                  <Input defaultValue={editingTrain.destination} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ETA</Label>
                  <Input type="time" defaultValue={editingTrain.eta} />
                </div>
                <div className="space-y-2">
                  <Label>ETD</Label>
                  <Input type="time" defaultValue={editingTrain.etd} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select defaultValue={editingTrain.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="On Time">On Time</SelectItem>
                    <SelectItem value="Delayed">Delayed</SelectItem>
                    <SelectItem value="Arrived">Arrived</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success("Train updated successfully")
                setEditDialogOpen(false)
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import CSV</DialogTitle>
            <DialogDescription>Upload a CSV file to import timetable data</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input type="file" accept=".csv" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setImportPreview(true)
                setImportDialogOpen(false)
                setActiveTab("import")
                toast.info("CSV file uploaded, preview ready")
              }}
            >
              Upload & Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Publish Dialog */}
      <Dialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Publish Schedule
            </DialogTitle>
            <DialogDescription>Select date range to publish the timetable to displays</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" defaultValue="2026-01-10" />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" defaultValue="2026-01-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Target Displays</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Displays</SelectItem>
                  <SelectItem value="gambir">Jakarta Gambir</SelectItem>
                  <SelectItem value="bandung">Bandung</SelectItem>
                  <SelectItem value="surabaya">Surabaya Gubeng</SelectItem>
                  <SelectItem value="yogya">Yogyakarta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPublishDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success("Schedule published to displays")
                setPublishDialogOpen(false)
              }}
            >
              <Send className="w-4 h-4 mr-2" />
              Publish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
