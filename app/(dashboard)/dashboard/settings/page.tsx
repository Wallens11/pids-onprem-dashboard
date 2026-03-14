"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { BreadcrumbNav } from "@/components/dashboard/breadcrumb-nav"
import { DataTable } from "@/components/dashboard/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
import { locations, displayGroups, type Location, type DisplayGroup } from "@/lib/mock-data"
import { Plus, MoreHorizontal, Edit, Trash2, MapPin, Layers, Building2, ImageIcon } from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("locations")
  const [addLocationOpen, setAddLocationOpen] = useState(false)
  const [editLocationOpen, setEditLocationOpen] = useState(false)
  const [addGroupOpen, setAddGroupOpen] = useState(false)
  const [editGroupOpen, setEditGroupOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const [editingGroup, setEditingGroup] = useState<DisplayGroup | null>(null)
  const [brandName, setBrandName] = useState("PIDS Dashboard")

  const handleDeleteLocation = (id: string) => {
    toast.success("Location deleted")
  }

  const handleDeleteGroup = (id: string) => {
    toast.success("Display group deleted")
  }

  const locationColumns = [
    {
      key: "station",
      header: "Station",
      cell: (loc: Location) => (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{loc.stationName}</span>
        </div>
      ),
    },
    {
      key: "area",
      header: "Area",
      cell: (loc: Location) => <span className="text-muted-foreground">{loc.areaName}</span>,
    },
    {
      key: "id",
      header: "ID",
      cell: (loc: Location) => <span className="font-mono text-xs text-muted-foreground">{loc.id}</span>,
    },
    {
      key: "actions",
      header: "",
      cell: (loc: Location) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setEditingLocation(loc)
                setEditLocationOpen(true)
              }}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDeleteLocation(loc.id)}
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

  const groupColumns = [
    {
      key: "name",
      header: "Group Name",
      cell: (group: DisplayGroup) => (
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{group.name}</span>
        </div>
      ),
    },
    {
      key: "displays",
      header: "Displays",
      cell: (group: DisplayGroup) => <span className="text-muted-foreground">{group.displayIds.length} displays</span>,
    },
    {
      key: "id",
      header: "ID",
      cell: (group: DisplayGroup) => <span className="font-mono text-xs text-muted-foreground">{group.id}</span>,
    },
    {
      key: "actions",
      header: "",
      cell: (group: DisplayGroup) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setEditingGroup(group)
                setEditGroupOpen(true)
              }}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDeleteGroup(group.id)}
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

  return (
    <div className="flex flex-col h-full">
      <Header title="Settings" subtitle="Configure system settings and master data" />

      <div className="flex-1 p-6 space-y-6">
        <BreadcrumbNav items={[{ label: "Settings" }]} />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-muted">
            <TabsTrigger value="locations">
              <MapPin className="w-4 h-4 mr-2" />
              Locations
            </TabsTrigger>
            <TabsTrigger value="groups">
              <Layers className="w-4 h-4 mr-2" />
              Display Groups
            </TabsTrigger>
            <TabsTrigger value="branding">
              <ImageIcon className="w-4 h-4 mr-2" />
              Branding
            </TabsTrigger>
          </TabsList>

          <TabsContent value="locations" className="mt-6 space-y-4">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-medium">Station Locations</CardTitle>
                  <CardDescription>Manage stations and areas where displays are installed</CardDescription>
                </div>
                <Button onClick={() => setAddLocationOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Location
                </Button>
              </CardHeader>
              <CardContent>
                <DataTable columns={locationColumns} data={locations} pageSize={10} emptyMessage="No locations found" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="groups" className="mt-6 space-y-4">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-medium">Display Groups</CardTitle>
                  <CardDescription>Group displays for bulk operations and targeting</CardDescription>
                </div>
                <Button onClick={() => setAddGroupOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Group
                </Button>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={groupColumns}
                  data={displayGroups}
                  pageSize={10}
                  emptyMessage="No display groups found"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding" className="mt-6 space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base font-medium">Application Branding</CardTitle>
                <CardDescription>Customize the appearance of the dashboard</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Application Name</Label>
                  <Input
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g. PIDS Dashboard"
                    className="max-w-md"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center border-2 border-dashed border-border">
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        Upload Logo
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">Recommended: 200x200px PNG or SVG</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <Button
                    onClick={() => {
                      toast.success("Branding settings saved")
                    }}
                  >
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Location Dialog */}
      <Dialog open={addLocationOpen} onOpenChange={setAddLocationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Location</DialogTitle>
            <DialogDescription>Add a new station or area</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Station Name</Label>
              <Input placeholder="e.g. Jakarta Gambir" />
            </div>
            <div className="space-y-2">
              <Label>Area Name</Label>
              <Input placeholder="e.g. Platform 1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddLocationOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success("Location added")
                setAddLocationOpen(false)
              }}
            >
              Add Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Location Dialog */}
      <Dialog open={editLocationOpen} onOpenChange={setEditLocationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Location</DialogTitle>
            <DialogDescription>Update location details</DialogDescription>
          </DialogHeader>
          {editingLocation && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Station Name</Label>
                <Input defaultValue={editingLocation.stationName} />
              </div>
              <div className="space-y-2">
                <Label>Area Name</Label>
                <Input defaultValue={editingLocation.areaName} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditLocationOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success("Location updated")
                setEditLocationOpen(false)
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Group Dialog */}
      <Dialog open={addGroupOpen} onOpenChange={setAddGroupOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Display Group</DialogTitle>
            <DialogDescription>Create a new group for displays</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Group Name</Label>
              <Input placeholder="e.g. Jakarta All Platforms" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input placeholder="Optional description" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddGroupOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success("Display group created")
                setAddGroupOpen(false)
              }}
            >
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Group Dialog */}
      <Dialog open={editGroupOpen} onOpenChange={setEditGroupOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Display Group</DialogTitle>
            <DialogDescription>Update group details and displays</DialogDescription>
          </DialogHeader>
          {editingGroup && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Group Name</Label>
                <Input defaultValue={editingGroup.name} />
              </div>
              <div className="space-y-2">
                <Label>Displays in Group</Label>
                <p className="text-sm text-muted-foreground">{editingGroup.displayIds.join(", ")}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditGroupOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success("Display group updated")
                setEditGroupOpen(false)
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
