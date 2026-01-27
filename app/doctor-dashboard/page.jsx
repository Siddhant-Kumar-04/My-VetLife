"use client"

import { useState } from "react"
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
} from "lucide-react"

export default function DoctorDashboardPage() {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patient: "Max",
      owner: "John Doe",
      type: "Golden Retriever",
      date: "Jan 25, 2026",
      time: "10:00 AM",
      reason: "Annual checkup",
      status: "pending",
    },
    {
      id: 2,
      patient: "Luna",
      owner: "Sarah Smith",
      type: "Persian Cat",
      date: "Jan 25, 2026",
      time: "11:30 AM",
      reason: "Vaccination",
      status: "pending",
    },
    {
      id: 3,
      patient: "Buddy",
      owner: "Mike Johnson",
      type: "Labrador",
      date: "Jan 25, 2026",
      time: "2:00 PM",
      reason: "Skin allergy",
      status: "confirmed",
    },
    {
      id: 4,
      patient: "Whiskers",
      owner: "Emily Brown",
      type: "Siamese Cat",
      date: "Jan 24, 2026",
      time: "3:30 PM",
      reason: "Dental cleaning",
      status: "completed",
    },
  ])

  const stats = [
    { label: "Today's Appointments", value: "5", icon: Calendar, trend: "+2 from yesterday" },
    { label: "Total Patients", value: "156", icon: Users, trend: "+12 this month" },
    { label: "This Month's Earnings", value: "$4,250", icon: DollarSign, trend: "+18% vs last month" },
    { label: "Average Rating", value: "4.9", icon: Star, trend: "124 reviews" },
  ]

  const handleAccept = (id) => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status: "confirmed" } : apt
    ))
  }

  const handleReject = (id) => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status: "cancelled" } : apt
    ))
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
                  <span className="hidden md:block">Dr. Sarah Wilson</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/login">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Welcome back, Dr. Wilson!</h1>
          <p className="text-muted-foreground">Here's your practice overview for today</p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
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
                      key={appointment.id}
                      className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/50">
                          <User className="h-6 w-6 text-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {appointment.patient} ({appointment.type})
                          </p>
                          <p className="text-sm text-muted-foreground">Owner: {appointment.owner}</p>
                          <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                          <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {appointment.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {appointment.time}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAccept(appointment.id)}
                          className="gap-1"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(appointment.id)}
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
                    key={appointment.id}
                    className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {appointment.patient} ({appointment.type})
                        </p>
                        <p className="text-sm text-muted-foreground">Owner: {appointment.owner}</p>
                        <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                        <div className="mt-2 flex gap-4 text-sm">
                          <span className="flex items-center gap-1 text-primary font-medium">
                            <Clock className="h-4 w-4" />
                            {appointment.time}
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
                    key={appointment.id}
                    className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <CheckCircle className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {appointment.patient} ({appointment.type})
                        </p>
                        <p className="text-sm text-muted-foreground">Owner: {appointment.owner}</p>
                        <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                        <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
                          <span>{appointment.date} at {appointment.time}</span>
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                <div key={day} className="rounded-lg border border-border p-4">
                  <p className="font-medium text-foreground">{day}</p>
                  <p className="text-sm text-muted-foreground">9:00 AM - 5:00 PM</p>
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
