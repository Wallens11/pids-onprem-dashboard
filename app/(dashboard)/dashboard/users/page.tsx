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
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { users, type User } from "@/lib/mock-data"
import { Search, Plus, MoreHorizontal, Edit, Trash2, UserCog, Shield, Eye, Key } from "lucide-react"
import { toast } from "sonner"

const permissions = [
  { id: "view_dashboard", label: "View Dashboard", category: "Dashboard" },
  { id: "manage_displays", label: "Manage Displays", category: "Displays" },
  { id: "view_displays", label: "View Displays", category: "Displays" },
  { id: "manage_trains", label: "Manage Timetable", category: "Trains" },
  { id: "view_trains", label: "View Timetable", category: "Trains" },
  { id: "manage_announcements", label: "Manage Announcements", category: "Announcements" },
  { id: "trigger_emergency", label: "Trigger Emergency", category: "Emergency" },
  { id: "manage_templates", label: "Manage Templates", category: "Templates" },
  { id: "upload_media", label: "Upload Media", category: "Media" },
  { id: "manage_users", label: "Manage Users", category: "Users" },
  { id: "view_logs", label: "View Audit Logs", category: "Logs" },
  { id: "manage_settings", label: "Manage Settings", category: "Settings" },
]

const rolePermissions: Record<string, string[]> = {
  Admin: permissions.map((p) => p.id),
  Operator: [
    "view_dashboard",
    "manage_displays",
    "view_displays",
    "manage_trains",
    "view_trains",
    "manage_announcements",
    "manage_templates",
    "upload_media",
    "view_logs",
  ],
  Viewer: ["view_dashboard", "view_displays", "view_trains", "view_logs"],
}

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("users")
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const handleDelete = (id: string) => {
    toast.success("User deleted")
  }

  const handleResetPassword = (email: string) => {
    toast.success(`Password reset email sent to ${email}`)
  }

  const columns = [
    {
      key: "name",
      header: "User",
      cell: (user: User) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">{user.name.charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      cell: (user: User) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
            user.role === "Admin"
              ? "bg-primary/10 text-primary"
              : user.role === "Operator"
                ? "bg-warning/10 text-warning"
                : "bg-muted text-muted-foreground"
          }`}
        >
          {user.role === "Admin" && <Shield className="w-3 h-3" />}
          {user.role === "Operator" && <UserCog className="w-3 h-3" />}
          {user.role === "Viewer" && <Eye className="w-3 h-3" />}
          {user.role}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (user: User) => <StatusBadge status={user.status} />,
    },
    {
      key: "actions",
      header: "",
      cell: (user: User) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setEditingUser(user)
                setEditDialogOpen(true)
              }}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleResetPassword(user.email)}>
              <Key className="w-4 h-4 mr-2" />
              Reset Password
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(user.id)} className="text-destructive focus:text-destructive">
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
      <Header title="Users & Roles" subtitle="Manage user accounts and permissions" />

      <div className="flex-1 p-6 space-y-6">
        <BreadcrumbNav items={[{ label: "Users & Roles" }]} />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-muted">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="roles">Role Permissions</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6 space-y-4">
            {/* Filters */}
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative flex-1 min-w-[200px] max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 bg-secondary border-0"
                    />
                  </div>

                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[130px] bg-secondary border-0">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Operator">Operator</SelectItem>
                      <SelectItem value="Viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button className="ml-auto" onClick={() => setAddDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Users Table */}
            <DataTable columns={columns} data={filteredUsers} pageSize={10} emptyMessage="No users found" />
          </TabsContent>

          <TabsContent value="roles" className="mt-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base font-medium">Permission Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-4 py-3 text-left text-sm font-medium">Permission</th>
                        <th className="px-4 py-3 text-center text-sm font-medium">
                          <div className="flex items-center justify-center gap-1">
                            <Shield className="w-4 h-4" />
                            Admin
                          </div>
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-medium">
                          <div className="flex items-center justify-center gap-1">
                            <UserCog className="w-4 h-4" />
                            Operator
                          </div>
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-medium">
                          <div className="flex items-center justify-center gap-1">
                            <Eye className="w-4 h-4" />
                            Viewer
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {permissions.map((permission, index) => {
                        const showCategory = index === 0 || permissions[index - 1].category !== permission.category

                        return (
                          <>
                            {showCategory && (
                              <tr key={`cat-${permission.category}`}>
                                <td
                                  colSpan={4}
                                  className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted/50"
                                >
                                  {permission.category}
                                </td>
                              </tr>
                            )}
                            <tr key={permission.id} className="border-b border-border/50">
                              <td className="px-4 py-3 text-sm">{permission.label}</td>
                              <td className="px-4 py-3 text-center">
                                <Checkbox checked={rolePermissions.Admin.includes(permission.id)} disabled />
                              </td>
                              <td className="px-4 py-3 text-center">
                                <Checkbox checked={rolePermissions.Operator.includes(permission.id)} disabled />
                              </td>
                              <td className="px-4 py-3 text-center">
                                <Checkbox checked={rolePermissions.Viewer.includes(permission.id)} disabled />
                              </td>
                            </tr>
                          </>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add User Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input placeholder="e.g. John Doe" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="e.g. john.doe@kai.id" />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select defaultValue="Operator">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Operator">Operator</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Temporary Password</Label>
              <Input type="password" placeholder="Enter temporary password" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success("User created successfully")
                setAddDialogOpen(false)
              }}
            >
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user account details</DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input defaultValue={editingUser.name} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" defaultValue={editingUser.email} />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select defaultValue={editingUser.role}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Operator">Operator</SelectItem>
                    <SelectItem value="Viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select defaultValue={editingUser.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
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
                toast.success("User updated successfully")
                setEditDialogOpen(false)
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
