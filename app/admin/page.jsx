"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Users,
  Stethoscope,
  Calendar,
  IndianRupee,
  TrendingUp,
  Search,
  MoreVertical,
  CheckCircle,
  XCircle,
  Shield,
  Bell,
  Settings,
  LogOut,
  User,
  RefreshCw,
  Loader2,
  AlertCircle,
} from "lucide-react"
import api from "@/lib/api"
import { useAuth } from "@/lib/AuthContext"

export default function AdminDashboardPage() {
  const router = useRouter()
  const { logout } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statsData, setStatsData] = useState(null)
  const [pendingDoctors, setPendingDoctors] = useState([])
  const [recentAppointments, setRecentAppointments] = useState([])
  const [ownerUsers, setOwnerUsers] = useState([])
  const [doctorUsers, setDoctorUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState({})
  const [error, setError] = useState("")

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const [statsRes, pendingRes, appointmentsRes, ownersRes, doctorsRes] = await Promise.all([
        api.getAdminStats(),
        api.getPendingDoctors(),
        api.getAllAppointments(),
        api.getAllUsers({ role: "owner" }),
        api.getAllUsers({ role: "doctor" }),
      ])
      setStatsData(statsRes.data)
      setPendingDoctors(pendingRes.data || [])
      setRecentAppointments((appointmentsRes.data || []).slice(0, 10))
      setOwnerUsers(ownersRes.data || [])
      setDoctorUsers(doctorsRes.data || [])
    } catch (err) {
      setError(err.message || "Failed to load admin data")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // ── Approve a pending doctor ──────────────────────────────────────────────
  const handleApprove = async (doctorId) => {
    setActionLoading((prev) => ({ ...prev, [doctorId]: "approving" }))
    try {
      await api.approveDoctor(doctorId)
      setPendingDoctors((prev) => prev.filter((d) => d._id !== doctorId))
      // Refresh stats and doctor list
      const [statsRes, doctorsRes] = await Promise.all([
        api.getAdminStats(),
        api.getAllUsers({ role: "doctor" }),
      ])
      setStatsData(statsRes.data)
      setDoctorUsers(doctorsRes.data || [])
    } catch (err) {
      alert(err.message || "Failed to approve doctor")
    } finally {
      setActionLoading((prev) => ({ ...prev, [doctorId]: null }))
    }
  }

  // ── Reject a pending doctor ───────────────────────────────────────────────
  const handleReject = async (doctorId) => {
    const reason = window.prompt("Rejection reason (optional):")
    if (reason === null) return // user cancelled prompt
    setActionLoading((prev) => ({ ...prev, [doctorId]: "rejecting" }))
    try {
      await api.rejectDoctor(doctorId, reason)
      setPendingDoctors((prev) => prev.filter((d) => d._id !== doctorId))
    } catch (err) {
      alert(err.message || "Failed to reject doctor")
    } finally {
      setActionLoading((prev) => ({ ...prev, [doctorId]: null }))
    }
  }

  // ── Suspend a user ────────────────────────────────────────────────────────
  const handleSuspend = async (userId, isDoctor = false) => {
    if (!confirm("Are you sure you want to suspend this user?")) return
    try {
      await api.suspendUser(userId)
      const setter = isDoctor ? setDoctorUsers : setOwnerUsers
      setter((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isActive: false } : u))
      )
    } catch (err) {
      alert(err.message || "Failed to suspend user")
    }
  }

  // ── Delete a user ─────────────────────────────────────────────────────────
  const handleDeleteUser = async (userId, isDoctor = false) => {
    if (!confirm("Delete this user permanently? This cannot be undone.")) return
    try {
      await api.deleteUser(userId)
      const setter = isDoctor ? setDoctorUsers : setOwnerUsers
      setter((prev) => prev.filter((u) => u._id !== userId))
    } catch (err) {
      alert(err.message || "Failed to delete user")
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":   return "bg-primary/10 text-primary"
      case "accepted":
      case "confirmed":   return "bg-blue-500/10 text-blue-500"
      case "pending":     return "bg-yellow-500/10 text-yellow-600"
      case "cancelled":   return "bg-destructive/10 text-destructive"
      case "in-progress": return "bg-purple-500/10 text-purple-600"
      case "on-the-way":
      case "arrived":     return "bg-orange-500/10 text-orange-600"
      default:            return "bg-muted text-muted-foreground"
    }
  }

  const filteredOwners = ownerUsers.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredDoctors = doctorUsers.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = [
    {
      label: "Total Pet Owners",
      value: statsData ? String(statsData.totalUsers) : "—",
      icon: Users,
      trend: `${statsData?.pendingDoctors ?? 0} pending doctor approvals`,
      color: "text-blue-500",
    },
    {
      label: "Verified Doctors",
      value: statsData ? String(statsData.totalDoctors) : "—",
      icon: Stethoscope,
      trend: `${statsData?.pendingDoctors ?? 0} awaiting approval`,
      color: "text-primary",
    },
    {
      label: "Total Appointments",
      value: statsData ? String(statsData.totalAppointments) : "—",
      icon: Calendar,
      trend: "All time",
      color: "text-accent",
    },
    {
      label: "Revenue",
      value: statsData ? `₹${(statsData.revenue || 0).toLocaleString()}` : "—",
      icon: IndianRupee,
      trend: "From completed appointments",
      color: "text-green-500",
    },
  ]

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <Stethoscope className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Vetic</span>
            <span className="rounded-full bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive">
              Admin
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {/* Bell badge shows count of pending doctor approvals */}
            <Button variant="ghost" size="icon" className="relative" onClick={fetchData}>
              <Bell className="h-5 w-5" />
              {(statsData?.pendingDoctors ?? 0) > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                  {statsData.pendingDoctors}
                </span>
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10">
                    <Shield className="h-4 w-4 text-destructive" />
                  </div>
                  <span className="hidden md:block">Admin</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    await logout()
                    router.push("/login")
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Welcome */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Monitor and manage the Vetic platform</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={fetchData}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm">{error}</p>
            <Button variant="ghost" size="sm" className="ml-auto text-destructive" onClick={fetchData}>
              Retry
            </Button>
          </div>
        )}

        {/* ── Stats Grid ── */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 text-primary" />
                  {stat.trend}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Main two-column ── */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Pending Verifications */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Pending Verifications
                {pendingDoctors.length > 0 && (
                  <span className="ml-auto rounded-full bg-destructive px-2 py-0.5 text-xs font-bold text-destructive-foreground">
                    {pendingDoctors.length}
                  </span>
                )}
              </CardTitle>
              <CardDescription>Doctor applications awaiting approval</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingDoctors.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  <CheckCircle className="h-8 w-8 text-primary" />
                  <p className="text-sm text-muted-foreground">No pending approvals</p>
                </div>
              ) : (
                pendingDoctors.map((doctor) => {
                  const busy = actionLoading[doctor._id]
                  return (
                    <div key={doctor._id} className="rounded-lg border border-border p-4">
                      <p className="font-semibold text-foreground">
                        {doctor.user?.name || "Unknown"}
                      </p>
                      <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                      {doctor.licenseNumber && (
                        <p className="text-xs text-muted-foreground">
                          License: {doctor.licenseNumber}
                        </p>
                      )}
                      {doctor.user?.email && (
                        <p className="text-xs text-muted-foreground">{doctor.user.email}</p>
                      )}
                      <p className="mt-1 text-xs text-muted-foreground">
                        Applied: {new Date(doctor.createdAt).toLocaleDateString()}
                      </p>
                      <div className="mt-3 flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 gap-1"
                          onClick={() => handleApprove(doctor._id)}
                          disabled={!!busy}
                        >
                          {busy === "approving" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 gap-1 bg-transparent"
                          onClick={() => handleReject(doctor._id)}
                          disabled={!!busy}
                        >
                          {busy === "rejecting" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                          Reject
                        </Button>
                      </div>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>

          {/* Recent Appointments */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Recent Appointments
              </CardTitle>
              <CardDescription>Latest platform activity</CardDescription>
            </CardHeader>
            <CardContent>
              {recentAppointments.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-12 text-center">
                  <Calendar className="h-10 w-10 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">No appointments yet</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Pet</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentAppointments.map((apt) => (
                      <TableRow key={apt._id}>
                        <TableCell className="font-medium">
                          {apt.doctor?.user?.name || "—"}
                        </TableCell>
                        <TableCell>
                          {apt.pet ? `${apt.pet.name} (${apt.pet.breed || apt.pet.type})` : "—"}
                        </TableCell>
                        <TableCell>{apt.owner?.name || "—"}</TableCell>
                        <TableCell>
                          {new Date(apt.appointmentDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium capitalize ${getStatusColor(apt.status)}`}
                          >
                            {apt.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── User Management ── */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  User Management
                </CardTitle>
                <CardDescription>Manage platform users</CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="owners">
              <TabsList>
                <TabsTrigger value="owners">Pet Owners ({ownerUsers.length})</TabsTrigger>
                <TabsTrigger value="doctors">Doctors ({doctorUsers.length})</TabsTrigger>
              </TabsList>

              {/* Pet Owners tab */}
              <TabsContent value="owners" className="mt-4">
                {filteredOwners.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">No owners found</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOwners.map((u) => (
                        <TableRow key={u._id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              {u.name}
                            </div>
                          </TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell>{u.phone || "—"}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                u.isActive !== false
                                  ? "bg-primary/10 text-primary"
                                  : "bg-destructive/10 text-destructive"
                              }`}
                            >
                              {u.isActive !== false ? "Active" : "Suspended"}
                            </span>
                          </TableCell>
                          <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleSuspend(u._id, false)}>
                                  Suspend User
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleDeleteUser(u._id, false)}
                                >
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>

              {/* Doctors tab */}
              <TabsContent value="doctors" className="mt-4">
                {filteredDoctors.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">No doctors found</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Verified</TableHead>
                        <TableHead>Account Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDoctors.map((u) => (
                        <TableRow key={u._id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                <Stethoscope className="h-4 w-4 text-primary" />
                              </div>
                              {u.name}
                            </div>
                          </TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell>{u.phone || "—"}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                u.isVerified
                                  ? "bg-primary/10 text-primary"
                                  : "bg-yellow-500/10 text-yellow-600"
                              }`}
                            >
                              {u.isVerified ? "Verified" : "Pending"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                u.isActive !== false
                                  ? "bg-green-500/10 text-green-600"
                                  : "bg-destructive/10 text-destructive"
                              }`}
                            >
                              {u.isActive !== false ? "Active" : "Suspended"}
                            </span>
                          </TableCell>
                          <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleSuspend(u._id, true)}>
                                  Suspend Doctor
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleDeleteUser(u._id, true)}
                                >
                                  Delete Doctor
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
