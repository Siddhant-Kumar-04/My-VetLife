"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dog, Calendar, Clock, Star, ArrowRight, Plus, Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/AuthContext"

export default function DashboardPage() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [appointmentsRes, petsRes] = await Promise.all([
        api.getAppointments({ status: "confirmed,pending" }),
        api.getPets()
      ])
      setAppointments(appointmentsRes.data || [])
      setPets(petsRes.data || [])
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const upcomingAppointments = appointments
    .filter(apt => ["confirmed", "pending"].includes(apt.status))
    .slice(0, 2)

  const stats = [
    { label: "My Pets", value: pets.length, icon: Dog, href: "/dashboard/pets" },
    { label: "Upcoming", value: upcomingAppointments.length, icon: Calendar, href: "/dashboard/appointments" },
    { label: "Completed", value: appointments.filter(a => a.status === "completed").length, icon: Clock, href: "/dashboard/history" },
  ]

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {user?.name || "there"}!
          </h1>
          <p className="text-muted-foreground">Manage your pets and appointments</p>
        </div>
        <Button asChild>
          <Link href="/doctors">
            <Plus className="mr-2 h-4 w-4" />
            Book Appointment
          </Link>
        </Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {!loading && (
        <>
          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <Link key={stat.label} href={stat.href}>
                <Card className="transition-colors hover:border-primary/50">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </CardTitle>
                    <stat.icon className="h-5 w-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Upcoming Appointments */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>Your scheduled consultations</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/appointments" className="gap-1">
                    View All <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingAppointments.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    No upcoming appointments
                  </p>
                ) : (
                  upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment._id}
                      className="flex items-start gap-4 rounded-lg border border-border p-4"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-foreground">
                              {appointment.doctor?.user?.name || "Doctor"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {appointment.doctor?.specialty}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              appointment.status === "confirmed"
                                ? "bg-primary/10 text-primary"
                                : "bg-accent text-accent-foreground"
                            }`}
                          >
                            {appointment.status}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span>{appointment.pet?.name} ({appointment.pet?.breed})</span>
                          <span>{formatDate(appointment.appointmentDate)}</span>
                          <span>{appointment.appointmentTime}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* My Pets */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>My Pets</CardTitle>
                  <CardDescription>Your registered pets</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/pets" className="gap-1">
                    Manage <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {pets.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    No pets added yet
                  </p>
                ) : (
                  pets.slice(0, 3).map((pet) => (
                    <div
                      key={pet._id}
                      className="flex items-center gap-4 rounded-lg border border-border p-4"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/50">
                        <Dog className="h-6 w-6 text-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{pet.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {pet.breed} - {pet.age?.years || 0} years
                        </p>
                      </div>
                      <Button variant="outline" size="sm" asChild className="bg-transparent">
                        <Link href={`/dashboard/pets`}>View</Link>
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you can do</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto flex-col gap-2 p-4 bg-transparent" asChild>
              <Link href="/doctors">
                <Calendar className="h-6 w-6 text-primary" />
                <span>Book Consultation</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4 bg-transparent" asChild>
              <Link href="/dashboard/pets">
                <Plus className="h-6 w-6 text-primary" />
                <span>Add New Pet</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4 bg-transparent" asChild>
              <Link href="/dashboard/history">
                <Clock className="h-6 w-6 text-primary" />
                <span>View History</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4 bg-transparent" asChild>
              <Link href="/dashboard/appointments">
                <Star className="h-6 w-6 text-primary" />
                <span>Rate Doctor</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
