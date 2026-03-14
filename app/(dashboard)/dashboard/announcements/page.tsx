"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { BreadcrumbNav } from "@/components/dashboard/breadcrumb-nav"
import { DataTable } from "@/components/dashboard/data-table"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { announcements, type Announcement } from "@/lib/mock-data"
import { Search, Filter, Plus, MoreHorizontal, Edit, Trash2, Eye, Pin, Type, Monitor } from "lucide-react"
import { toast } from "sonner"

export default function AnnouncementsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [previewAnnouncement, setPreviewAnnouncement] = useState<Announcement | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    priority: "medium" as "low" | "medium" | "high",
    targetType: "all" as "all" | "location" | "display",
    targetIds: [] as string[],
    startAt: "",
    endAt: "",
    pinned: false,
    ticker: false,
  })

  // Filter announcements
  const filteredAnnouncements = announcements.filter((ann) => {
    const matchesSearch =
      ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.message.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || ann.status === statusFilter
    const matchesPriority = priorityFilter === "all" || ann.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleDelete = (id: string) => {
    toast.success(`Announcement deleted`)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      message: "",
      priority: "medium",
      targetType: "all",
      targetIds: [],
      startAt: "",
      endAt: "",
      pinned: false,
      ticker: false,
    })
  }

  const columns = [
    {
      key: "title",
      header: "Announcement",
      cell: (ann: Announcement) => (
        <div className="max-w-[300px]">
          <div className="flex items-center gap-2">
            <p className="font-medium truncate">{ann.title}</p>
            {ann.pinned && <Pin className="w-3 h-3 text-primary" />}
            {ann.ticker && <Type className="w-3 h-3 text-muted-foreground" />}
          </div>
          <p className="text-xs text-muted-foreground truncate">{ann.message}</p>
        </div>
      ),
    },
    {
      key: "priority",
      header: "Priority",
      cell: (ann: Announcement) => <StatusBadge status={ann.priority} />,
    },
    {
      key: "target",
      header: "Target",
      cell: (ann: Announcement) => (
        <span className="text-sm text-muted-foreground">
          {ann.targetType === "all" ? "All Displays" : `${ann.targetIds.length} ${ann.targetType}(s)`}
        </span>
      ),
    },
    {
      key: "schedule",
      header: "Schedule",
      cell: (ann: Announcement) => (
        <div className="text-sm">
          <p>{new Date(ann.startAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
          <p className="text-xs text-muted-foreground">
            to {new Date(ann.endAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (ann: Announcement) => <StatusBadge status={ann.status} />,
    },
    {
      key: "actions",
      header: "",
      cell: (ann: Announcement) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setPreviewAnnouncement(ann)
                setPreviewDialogOpen(true)
              }}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setEditingAnnouncement(ann)
                setEditDialogOpen(true)
              }}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(ann.id)} className="text-destructive focus:text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: "w-12",
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <Header title="Announcements" subtitle="Manage announcements displayed on screens" />

      <div className="flex-1 p-6 space-y-6">
        <BreadcrumbNav items={[{ label: "Announcements" }]} />

        {/* Filters and Actions */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search announcements..."
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
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[130px] bg-secondary border-0">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="ml-auto"
                onClick={() => {
                  resetForm()
                  setAddDialogOpen(true)
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Announcement
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Announcements Table */}
        <DataTable columns={columns} data={filteredAnnouncements} pageSize={10} emptyMessage="No announcements found" />
      </div>

      {/* Add/Edit Announcement Dialog */}
      <Dialog
        open={addDialogOpen || editDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setAddDialogOpen(false)
            setEditDialogOpen(false)
            setEditingAnnouncement(null)
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingAnnouncement ? "Edit Announcement" : "New Announcement"}</DialogTitle>
            <DialogDescription>
              {editingAnnouncement ? "Update announcement details" : "Create a new announcement to display on screens"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6 py-4">
            <div className="col-span-2 space-y-2">
              <Label>Title</Label>
              <Input
                placeholder="Announcement title"
                defaultValue={editingAnnouncement?.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Message</Label>
              <Textarea
                placeholder="Announcement message content..."
                rows={4}
                defaultValue={editingAnnouncement?.message || ""}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                defaultValue={editingAnnouncement?.priority || "medium"}
                onValueChange={(v) => setFormData({ ...formData, priority: v as "low" | "medium" | "high" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Target</Label>
              <Select
                defaultValue={editingAnnouncement?.targetType || "all"}
                onValueChange={(v) => setFormData({ ...formData, targetType: v as "all" | "location" | "display" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Displays</SelectItem>
                  <SelectItem value="location">Specific Locations</SelectItem>
                  <SelectItem value="display">Display Groups</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Start Date & Time</Label>
              <Input
                type="datetime-local"
                defaultValue={editingAnnouncement?.startAt.slice(0, 16) || ""}
                onChange={(e) => setFormData({ ...formData, startAt: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>End Date & Time</Label>
              <Input
                type="datetime-local"
                defaultValue={editingAnnouncement?.endAt.slice(0, 16) || ""}
                onChange={(e) => setFormData({ ...formData, endAt: e.target.value })}
              />
            </div>
            <div className="col-span-2 flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Switch
                  id="pinned"
                  defaultChecked={editingAnnouncement?.pinned || false}
                  onCheckedChange={(c) => setFormData({ ...formData, pinned: c })}
                />
                <Label htmlFor="pinned" className="flex items-center gap-2 cursor-pointer">
                  <Pin className="w-4 h-4" />
                  Pin (Sticky)
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="ticker"
                  defaultChecked={editingAnnouncement?.ticker || false}
                  onCheckedChange={(c) => setFormData({ ...formData, ticker: c })}
                />
                <Label htmlFor="ticker" className="flex items-center gap-2 cursor-pointer">
                  <Type className="w-4 h-4" />
                  Scrolling Ticker
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setAddDialogOpen(false)
                setEditDialogOpen(false)
                setEditingAnnouncement(null)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success(editingAnnouncement ? "Announcement updated" : "Announcement created")
                setAddDialogOpen(false)
                setEditDialogOpen(false)
                setEditingAnnouncement(null)
              }}
            >
              {editingAnnouncement ? "Save Changes" : "Create Announcement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Display Preview
            </DialogTitle>
            <DialogDescription>Preview how this announcement will appear on displays</DialogDescription>
          </DialogHeader>
          {previewAnnouncement && (
            <div className="py-4">
              {/* Mock display frame */}
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden border-4 border-gray-800">
                <div className="h-full flex flex-col">
                  {/* Header */}
                  <div className="bg-primary px-6 py-3">
                    <h2 className="text-primary-foreground font-bold text-lg">PIDS - Station Information</h2>
                  </div>

                  {/* Main content */}
                  <div className="flex-1 p-6 flex items-center justify-center">
                    <div
                      className={`text-center p-6 rounded-lg w-full max-w-md ${
                        previewAnnouncement.priority === "high"
                          ? "bg-destructive/20 border-2 border-destructive"
                          : previewAnnouncement.priority === "medium"
                            ? "bg-warning/20 border-2 border-warning"
                            : "bg-primary/20 border-2 border-primary"
                      }`}
                    >
                      {previewAnnouncement.pinned && <Pin className="w-5 h-5 mx-auto mb-2 text-primary" />}
                      <h3 className="text-xl font-bold text-white mb-2">{previewAnnouncement.title}</h3>
                      <p className="text-gray-300">{previewAnnouncement.message}</p>
                    </div>
                  </div>

                  {/* Ticker */}
                  {previewAnnouncement.ticker && (
                    <div className="bg-primary/80 px-4 py-2 overflow-hidden">
                      <div className="animate-marquee whitespace-nowrap text-primary-foreground">
                        {previewAnnouncement.message} • {previewAnnouncement.message}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
