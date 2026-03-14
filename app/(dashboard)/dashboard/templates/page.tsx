"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { BreadcrumbNav } from "@/components/dashboard/breadcrumb-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { templates, displays, displayGroups, type Template } from "@/lib/mock-data"
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Layout,
  Copy,
  Send,
  Grid3X3,
  Rows3,
  Columns3,
  PanelTop,
} from "lucide-react"
import { toast } from "sonner"

const layoutPresets = [
  {
    id: "2-col",
    name: "Two Columns",
    icon: Columns3,
    zones: ["left", "right"],
  },
  {
    id: "3-area",
    name: "Three Areas",
    icon: Grid3X3,
    zones: ["header", "main", "sidebar"],
  },
  {
    id: "ticker-main",
    name: "Ticker + Main",
    icon: PanelTop,
    zones: ["header", "main", "ticker"],
  },
  {
    id: "full",
    name: "Full Screen",
    icon: Rows3,
    zones: ["full-screen"],
  },
]

const contentTypes = [
  { id: "timetable", label: "Timetable" },
  { id: "announcement", label: "Announcement" },
  { id: "media", label: "Media/Image" },
  { id: "clock", label: "Clock/Date" },
  { id: "weather", label: "Weather" },
]

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [builderOpen, setBuilderOpen] = useState(false)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [selectedPreset, setSelectedPreset] = useState<string>("ticker-main")
  const [zoneAssignments, setZoneAssignments] = useState<Record<string, string>>({})

  const filteredTemplates = templates.filter((tpl) => tpl.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleCreateTemplate = () => {
    setCreateDialogOpen(false)
    setBuilderOpen(true)
  }

  const handleSaveTemplate = () => {
    toast.success("Template saved successfully")
    setBuilderOpen(false)
    setSelectedPreset("ticker-main")
    setZoneAssignments({})
  }

  const handleAssignTemplate = () => {
    toast.success("Template assigned to selected displays")
    setAssignDialogOpen(false)
    setSelectedTemplate(null)
  }

  const handleDelete = (id: string) => {
    toast.success("Template deleted")
  }

  const handleDuplicate = (tpl: Template) => {
    toast.success(`Template "${tpl.name}" duplicated`)
  }

  const currentPreset = layoutPresets.find((p) => p.id === selectedPreset)

  return (
    <div className="flex flex-col h-full">
      <Header title="Templates / Layouts" subtitle="Design and manage display templates" />

      <div className="flex-1 p-6 space-y-6">
        <BreadcrumbNav items={[{ label: "Templates / Layouts" }]} />

        {/* Search and Actions */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-secondary border-0"
                />
              </div>
              <Button onClick={() => setCreateDialogOpen(true)} className="ml-auto">
                <Plus className="w-4 h-4 mr-2" />
                New Template
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((tpl) => (
            <Card key={tpl.templateId} className="bg-card border-border overflow-hidden group">
              {/* Preview */}
              <div className="aspect-video bg-gray-900 relative">
                <div className="absolute inset-0 p-2 flex flex-col">
                  {/* Mock layout preview based on zones */}
                  {tpl.zones.includes("header") && <div className="h-6 bg-primary/60 rounded mb-1" />}
                  <div className="flex-1 flex gap-1">
                    {tpl.zones.includes("left-panel") && <div className="w-1/3 bg-muted/40 rounded" />}
                    <div className="flex-1 bg-muted/20 rounded flex items-center justify-center">
                      <Layout className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                    {tpl.zones.includes("right-panel") && <div className="w-1/3 bg-muted/40 rounded" />}
                  </div>
                  {tpl.zones.includes("ticker") && <div className="h-4 bg-primary/40 rounded mt-1" />}
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setSelectedTemplate(tpl)
                      setBuilderOpen(true)
                    }}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setSelectedTemplate(tpl)
                      setAssignDialogOpen(true)
                    }}
                  >
                    <Send className="w-4 h-4 mr-1" />
                    Assign
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{tpl.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {tpl.zones.length} zones • {tpl.theme} theme
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Last edited:{" "}
                      {new Date(tpl.lastEdited).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDuplicate(tpl)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(tpl.templateId)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  {tpl.zones.map((zone) => (
                    <Badge key={zone} variant="outline" className="text-xs">
                      {zone}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Create Template Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Template</DialogTitle>
            <DialogDescription>Choose a layout preset to start building your template</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Template Name</Label>
              <Input placeholder="e.g. Platform Display v2" />
            </div>

            <div className="space-y-2">
              <Label>Layout Preset</Label>
              <div className="grid grid-cols-2 gap-3">
                {layoutPresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedPreset(preset.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-colors ${
                      selectedPreset === preset.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <preset.icon className="w-6 h-6 mb-2 text-muted-foreground" />
                    <p className="font-medium text-sm">{preset.name}</p>
                    <p className="text-xs text-muted-foreground">{preset.zones.length} zones</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Theme</Label>
              <Select defaultValue="dark">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="red">Red (Emergency)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTemplate}>Continue to Builder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Builder Dialog */}
      <Dialog open={builderOpen} onOpenChange={setBuilderOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Template Builder</DialogTitle>
            <DialogDescription>Assign content types to each zone of your template</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6 py-4">
            {/* Zone Configuration */}
            <div className="space-y-4">
              <h3 className="font-medium">Zone Configuration</h3>
              {currentPreset?.zones.map((zone) => (
                <div key={zone} className="space-y-2">
                  <Label className="capitalize">{zone.replace("-", " ")}</Label>
                  <Select
                    value={zoneAssignments[zone] || ""}
                    onValueChange={(v) => setZoneAssignments({ ...zoneAssignments, [zone]: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypes.map((ct) => (
                        <SelectItem key={ct.id} value={ct.id}>
                          {ct.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            {/* Live Preview */}
            <div className="space-y-4">
              <h3 className="font-medium">Preview</h3>
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden border-4 border-gray-800">
                <div className="h-full flex flex-col p-2">
                  {currentPreset?.zones.includes("header") && (
                    <div className="h-8 bg-primary rounded mb-1 flex items-center px-2">
                      <span className="text-xs text-primary-foreground font-medium">
                        {zoneAssignments["header"] || "Header"}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 flex gap-1">
                    {currentPreset?.zones.includes("left") && (
                      <div className="w-1/2 bg-muted/30 rounded flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">{zoneAssignments["left"] || "Left"}</span>
                      </div>
                    )}
                    {currentPreset?.zones.includes("main") && (
                      <div className="flex-1 bg-muted/20 rounded flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">{zoneAssignments["main"] || "Main"}</span>
                      </div>
                    )}
                    {currentPreset?.zones.includes("right") && (
                      <div className="w-1/2 bg-muted/30 rounded flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">{zoneAssignments["right"] || "Right"}</span>
                      </div>
                    )}
                    {currentPreset?.zones.includes("sidebar") && (
                      <div className="w-1/3 bg-muted/30 rounded flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">{zoneAssignments["sidebar"] || "Sidebar"}</span>
                      </div>
                    )}
                    {currentPreset?.zones.includes("full-screen") && (
                      <div className="flex-1 bg-muted/20 rounded flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">
                          {zoneAssignments["full-screen"] || "Full Screen"}
                        </span>
                      </div>
                    )}
                  </div>
                  {currentPreset?.zones.includes("ticker") && (
                    <div className="h-6 bg-primary/60 rounded mt-1 flex items-center px-2">
                      <span className="text-xs text-primary-foreground">{zoneAssignments["ticker"] || "Ticker"}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBuilderOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate}>Save Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Template Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Template</DialogTitle>
            <DialogDescription>Assign "{selectedTemplate?.name}" to displays or groups</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Target Type</Label>
              <Select defaultValue="display">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="display">Individual Displays</SelectItem>
                  <SelectItem value="group">Display Groups</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Select Displays</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose displays..." />
                </SelectTrigger>
                <SelectContent>
                  {displays.map((d) => (
                    <SelectItem key={d.displayId} value={d.displayId}>
                      {d.name} ({d.displayId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Or Select Groups</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose groups..." />
                </SelectTrigger>
                <SelectContent>
                  {displayGroups.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignTemplate}>
              <Send className="w-4 h-4 mr-2" />
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
