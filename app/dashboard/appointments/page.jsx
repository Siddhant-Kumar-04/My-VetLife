"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"

export default function AppointmentsPage() {
  const [appointments] = useState([
    {
      id: 1,
      doctor: "Dr. Sarah Wilson",
      specialty: "General Veterinarian",
      pet: "Max (Golden Retriever)",
      date: "Jan 25, 2026",
      time: "10:00 AM",
      location: "123 Pet Street, New York",
      phone: "+1 (555) 123-4567",
      status: "confirmed",
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "Feline Specialist",
      pet: "Luna (Persian Cat)",
      date: "Jan 28, 2026",
      time: "2:30 PM",
      location: "456 Animal Ave, New York",
      phone: "+1 (555) 987-6543",
      status: "pending",
    },
    {
      id: 3,
      doctor: "Dr. Emily Rodriguez",
      specialty: "General Veterinarian",
      pet: "Buddy (Labrador)",
      date: "Jan 15, 2026",
      time: "11:00 AM",
      location: "789 Vet Road, New York",
      phone: "+1 (555) 456-7890",
      status: "completed",
      rating: 5,
    },
    {
      id: 4,
      doctor: "Dr. James Brown",
      specialty: "Canine Specialist",
      pet: "Max (Golden Retriever)",
      date: "Jan 10, 2026",
      time: "3:00 PM",
      location: "321 Care Lane, New York",
      phone: "+1 (555) 321-0987",
      status: "cancelled",
    },
  ])

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-5 w-5 text-primary" />
      case "pending":
        return <AlertCircle className="h-5 w-5 text-accent" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-primary" />
      case "cancelled":
        return <XCircle className="h-5 w-5 text-destructive" />
      default:
        return null
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-primary/10 text-primary"
      case "pending":
        return "bg-accent/50 text-accent-foreground"
      case "completed":
        return "bg-primary/10 text-primary"
      case "cancelled":
        return "bg-destructive/10 text-destructive"
      default:
        return ""
    }
  }

  const filterAppointments = (status) => {
    if (status === "upcoming") {
      return appointments.filter((a) => a.status === "confirmed" || a.status === "pending")
    }
    if (status === "past") {
      return appointments.filter((a) => a.status === "completed" || a.status === "cancelled")
    }
    return appointments
  }

  const AppointmentCard = ({ appointment }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              {getStatusIcon(appointment.status)}
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">{appointment.doctor}</h3>
              <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
              <p className="text-sm font-medium text-foreground">{appointment.pet}</p>
            </div>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusColor(
              appointment.status
            )}`}
          >
            {appointment.status}
          </span>
        </div>

        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{appointment.date}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{appointment.time}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{appointment.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{appointment.phone}</span>
          </div>
        </div>

        {appointment.status === "completed" && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Your Rating:</span>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < (appointment.rating || 0)
                      ? "fill-accent text-accent"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {(appointment.status === "confirmed" || appointment.status === "pending") && (
            <>
              <Button variant="outline" size="sm" className="bg-transparent">
                Reschedule
              </Button>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive bg-transparent">
                Cancel
              </Button>
            </>
          )}
          {appointment.status === "completed" && !appointment.rating && (
            <Button size="sm">Rate Doctor</Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
          <p className="text-muted-foreground">View and manage your appointments</p>
        </div>
        <Button asChild>
          <Link href="/doctors">Book New Appointment</Link>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {filterAppointments("upcoming").length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No upcoming appointments</CardTitle>
                <CardDescription>
                  Book a consultation with a veterinarian to see your appointments here
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            filterAppointments("upcoming").map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {filterAppointments("past").length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No past appointments</CardTitle>
                <CardDescription>
                  Your completed and cancelled appointments will appear here
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            filterAppointments("past").map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {appointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
