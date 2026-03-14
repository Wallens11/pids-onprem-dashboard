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
import { media, type Media } from "@/lib/mock-data"
import {
  Search,
  Upload,
  MoreHorizontal,
  Trash2,
  Download,
  Info,
  ImageIcon,
  VideoIcon,
  Filter,
  Grid,
  List,
} from "lucide-react"
import { toast } from "sonner"

export default function MediaPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [tagFilter, setTagFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)

  // Get unique tags
  const allTags = [...new Set(media.flatMap((m) => m.tags))]

  const filteredMedia = media.filter((m) => {
    const matchesSearch = m.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || m.type === typeFilter
    const matchesTag = tagFilter === "all" || m.tags.includes(tagFilter)
    return matchesSearch && matchesType && matchesTag
  })

  const handleDelete = (id: string) => {
    toast.success("Media file deleted")
  }

  const handleUpload = () => {
    toast.success("File uploaded successfully")
    setUploadDialogOpen(false)
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Content Library" subtitle="Manage media files and assets" />

      <div className="flex-1 p-6 space-y-6">
        <BreadcrumbNav items={[{ label: "Content Library" }]} />

        {/* Filters and Actions */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search media..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-secondary border-0"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[120px] bg-secondary border-0">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="image">Images</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={tagFilter} onValueChange={setTagFilter}>
                  <SelectTrigger className="w-[130px] bg-secondary border-0">
                    <SelectValue placeholder="Tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tags</SelectItem>
                    {allTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-1 ml-auto">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              <Button onClick={() => setUploadDialogOpen(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Media Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredMedia.map((item) => (
              <Card
                key={item.id}
                className="bg-card border-border overflow-hidden group cursor-pointer"
                onClick={() => {
                  setSelectedMedia(item)
                  setDetailDialogOpen(true)
                }}
              >
                <div className="aspect-square bg-muted relative">
                  <img
                    src={item.url || "/placeholder.svg"}
                    alt={item.fileName}
                    className="w-full h-full object-cover"
                  />
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <VideoIcon className="w-10 h-10 text-white" />
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="sm" variant="secondary">
                      <Info className="w-4 h-4 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>

                <CardContent className="p-3">
                  <p className="font-medium text-sm truncate">{item.fileName}</p>
                  <p className="text-xs text-muted-foreground">{item.size}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-card border-border">
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">Preview</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">File Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Size</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Tags</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Uploaded</th>
                    <th className="px-4 py-3 text-left text-sm font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {filteredMedia.map((item) => (
                    <tr key={item.id} className="border-t border-border hover:bg-muted/30 cursor-pointer">
                      <td className="px-4 py-3">
                        <div className="w-12 h-12 rounded bg-muted overflow-hidden">
                          <img
                            src={item.url || "/placeholder.svg"}
                            alt={item.fileName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium">{item.fileName}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="capitalize">
                          {item.type === "image" ? (
                            <ImageIcon className="w-3 h-3 mr-1" />
                          ) : (
                            <VideoIcon className="w-3 h-3 mr-1" />
                          )}
                          {item.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{item.size}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {item.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-sm">
                        {new Date(item.uploadedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </td>
                      <td className="px-4 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedMedia(item)
                                setDetailDialogOpen(true)
                              }}
                            >
                              <Info className="w-4 h-4 mr-2" />
                              Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(item.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Media</DialogTitle>
            <DialogDescription>Upload images or videos to the content library</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
              <p className="font-medium mb-1">Drop files here or click to upload</p>
              <p className="text-sm text-muted-foreground">Supports: JPG, PNG, GIF, MP4, WebM</p>
              <Input id="file-input" type="file" accept="image/*,video/*" multiple className="hidden" />
            </div>

            <div className="space-y-2">
              <Label>Tags (comma separated)</Label>
              <Input placeholder="e.g. promotion, banner, logo" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Media Details</DialogTitle>
          </DialogHeader>
          {selectedMedia && (
            <div className="grid grid-cols-2 gap-6 py-4">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                <img
                  src={selectedMedia.url || "/placeholder.svg"}
                  alt={selectedMedia.fileName}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">File Name</Label>
                  <p className="font-medium">{selectedMedia.fileName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <p className="font-medium capitalize">{selectedMedia.type}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Size</Label>
                  <p className="font-medium">{selectedMedia.size}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Tags</Label>
                  <div className="flex gap-1 mt-1">
                    {selectedMedia.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Uploaded By</Label>
                  <p className="font-medium">{selectedMedia.uploadedBy}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Uploaded At</Label>
                  <p className="font-medium">
                    {new Date(selectedMedia.uploadedAt).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
              Close
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedMedia) handleDelete(selectedMedia.id)
                setDetailDialogOpen(false)
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
