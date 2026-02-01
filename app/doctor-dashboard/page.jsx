"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Calendar,
  Clock,
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  Star,
  Bell,
  Settings,
  LogOut,
  Stethoscope,
  TrendingUp,
  User,
  MoreVertical,
  Loader2,
} from "lucide-react"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/AuthContext"

export default function DoctorDashboardPage() {
  const { user, logout } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [doctorProfile, setDoctorProfile] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [appointmentsRes, profileRes, statsRes] = await Promise.all([
        api.getAppointments(),
        api.getDoctorProfile(),
        api.getDoctorStats()
      ])
      setAppointments(appointmentsRes.data || [])
      setDoctorProfile(profileRes.data)
      setStats(statsRes.data)
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (id) => {
    try {
      await api.confirmAppointment(id)
      await fetchDashboardData()
    } catch (error) {
      console.error("Failed to confirm appointment:", error)
    }
  }

  const handleReject = async (id) => {
    try {
      await api.cancelAppointment(id, "Declined by doctor")
      await fetchDashboardData()
    } catch (error) {
      console.error("Failed to reject appointment:", error)
    }
  }

  const handleLogout = async () => {
    await logout()
  }

  const filterAppointments = (status) => {
    if (status === "pending") {
      return appointments.filter(a => a.status === "pending")
    }
    if (status === "today") {
      return appointments.filter(a => a.status === "confirmed" || a.status === "pending")
    }
    if (status === "completed") {
      return appointments.filter(a => a.status === "completed")
    }
    return appointments
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const todayAppointments = appointments.filter(a => {
    const today = new Date().toDateString()
    const aptDate = new Date(a.appointmentDate).toDateString()
    return today === aptDate && (a.status === "confirmed" || a.status === "pending")
  })

  const statsData = [
    { 
      label: "Today's Appointments", 
      value: todayAppointments.length.toString(), 
      icon: Calendar, 
      trend: "Scheduled today" 
    },
    { 
      label: "Total Consultations", 
      value: stats?.totalConsultations?.toString() || "0", 
      icon: Users, 
      trend: "All time" 
    },
    { 
      label: "Consultation Fee", 
      value: `$${doctorProfile?.consultationFee || 0}`, 
      icon: DollarSign, 
      trend: "Per session" 
    },
    { 
      label: "Average Rating", 
      value: stats?.rating?.toFixed(1) || "0.0", 
      icon: Star, 
      trend: `${stats?.reviewCount || 0} reviews` 
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
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <Stethoscope className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Vetic</span>
            <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">Doctor</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="hidden md:block">{user?.name || "Doctor"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">Here's your practice overview for today</p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statsData.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-primary" />
                  {stat.trend}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Appointments Section */}
        <Card>
          <CardHeader>
            <CardTitle>Appointments</CardTitle>
            <CardDescription>Manage your appointment requests and schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" className="space-y-4">
              <TabsList>
                <TabsTrigger value="pending">
                  Pending ({filterAppointments("pending").length})
                </TabsTrigger>
                <TabsTrigger value="today">Today's Schedule</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4">
                {filterAppointments("pending").length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No pending appointments</p>
                ) : (
                  filterAppointments("pending").map((appointment) => (
                    <div
                      key={appointment._id}
                      className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/50">
                          <User className="h-6 w-6 text-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {appointment.pet?.name} ({appointment.pet?.breed})
                          </p>
                          <p className="text-sm text-muted-foreground">Owner: {appointment.owner?.name}</p>
                          <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                          <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(appointment.appointmentDate)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {appointment.appointmentTime}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAccept(appointment._id)}
                          className="gap-1"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(appointment._id)}
                          className="gap-1 text-destructive hover:text-destructive bg-transparent"
                        >
                          <XCircle className="h-4 w-4" />
                          Decline
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="today" className="space-y-4">
                {filterAppointments("today").map((appointment) => (
                  <div
                    key={appointment._id}
                    className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {appointment.pet?.name} ({appointment.pet?.breed})
                        </p>
                        <p className="text-sm text-muted-foreground">Owner: {appointment.owner?.name}</p>
                        <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                        <div className="mt-2 flex gap-4 text-sm">
                          <span className="flex items-center gap-1 text-primary font-medium">
                            <Clock className="h-4 w-4" />
                            {appointment.appointmentTime}
                          </span>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            appointment.status === "confirmed" 
                              ? "bg-primary/10 text-primary" 
                              : "bg-accent text-accent-foreground"
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Add Notes</DropdownMenuItem>
                        <DropdownMenuItem>Mark Complete</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Cancel</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="completed" className="space-y-4">
                {filterAppointments("completed").map((appointment) => (
                  <div
                    key={appointment._id}
                    className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                        <p className="font-semibold text-foreground">
                          {appointment.pet?.name} ({appointment.pet?.breed})
                        </p>
                        <p className="text-sm text-muted-foreground">Owner: {appointment.owner?.name}</p>
                                          <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <CheckCircle className="h-6 w-6 text-primary" />
                      </div>
                      <div>                        <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
                          <span>{formatDate(appointment.appointmentDate)} at {appointment.appointmentTime}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      View Notes
                    </Button>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Availability Settings */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Availability Settings</CardTitle>
            <CardDescription>Manage your available time slots for appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {doctorProfile?.availability && Object.entries(doctorProfile.availability).map(([day, slots]) => (
                <div key={day} className="rounded-lg border border-border p-4">
                  <p className="font-medium text-foreground capitalize">{day}</p>
                  <p className="text-sm text-muted-foreground">
                    {slots.available 
                      ? `${slots.start || '9:00 AM'} - ${slots.end || '5:00 PM'}`
                      : 'Unavailable'}
                  </p>
                  <Button variant="link" className="mt-2 h-auto p-0 text-primary">
                    Edit slots
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
