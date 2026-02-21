"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Calendar,
  Clock,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Navigation,
  Activity,
  MapPin,
} from "lucide-react"
import { api } from "@/lib/api"

const STATUS_CONFIG = {
  pending:      { color: "bg-accent/50 text-accent-foreground",    label: "Pending" },
  confirmed:    { color: "bg-blue-100 text-blue-700",               label: "Accepted" },
  accepted:     { color: "bg-blue-100 text-blue-700",               label: "Accepted" },
  "on-the-way": { color: "bg-orange-100 text-orange-700",           label: "On The Way" },
  arrived:      { color: "bg-yellow-100 text-yellow-700",           label: "Arrived" },
  "in-progress":{ color: "bg-purple-100 text-purple-700",           label: "In Progress" },
  completed:    { color: "bg-primary/10 text-primary",              label: "Completed" },
  cancelled:    { color: "bg-destructive/10 text-destructive",      label: "Cancelled" },
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  // Rating dialog
  const [ratingDialog, setRatingDialog] = useState({ open: false, appointmentId: null })
  const [ratingValue, setRatingValue] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [ratingSubmitting, setRatingSubmitting] = useState(false)

  // Live tracking dialog
  const [trackingDialog, setTrackingDialog] = useState({ open: false, data: null })
  const [trackingLoading, setTrackingLoading] = useState(false)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await api.getAppointments()
      setAppointments(response.data || [])
    } catch (error) {
      console.error("Failed to fetch appointments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelAppointment = async (id) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return
    try {
      await api.cancelAppointment(id, "Cancelled by user")
      await fetchAppointments()
    } catch (error) {
      console.error("Failed to cancel appointment:", error)
    }
  }

  const handleOpenRating = (appointmentId) => {
    setRatingValue(0)
    setReviewText("")
    setRatingDialog({ open: true, appointmentId })
  }

  const handleSubmitRating = async () => {
    if (!ratingValue) return
    try {
      setRatingSubmitting(true)
      await api.rateAppointment(ratingDialog.appointmentId, ratingValue, reviewText)
      setRatingDialog({ open: false, appointmentId: null })
      await fetchAppointments()
    } catch (error) {
      console.error("Failed to rate appointment:", error)
    } finally {
      setRatingSubmitting(false)
    }
  }

  const handleOpenTracking = async (id) => {
    setTrackingLoading(true)
    setTrackingDialog({ open: true, data: null })
    try {
      const response = await api.getLiveTracking(id)
      setTrackingDialog({ open: true, data: response.data })
    } catch (error) {
      console.error("Failed to get tracking:", error)
      setTrackingDialog({ open: true, data: { error: "Could not load tracking data." } })
    } finally {
      setTrackingLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const isLiveTrackable = (status) =>
    ["on-the-way", "arrived", "in-progress"].includes(status)

  const filterAppointments = (type) => {
    if (type === "upcoming")
      return appointments.filter((a) =>
        ["pending", "accepted", "confirmed", "on-the-way", "arrived", "in-progress"].includes(a.status)
      )
    if (type === "past")
      return appointments.filter((a) =>
        ["completed", "cancelled"].includes(a.status)
      )
    return appointments
  }

  const AppointmentCard = ({ appointment }) => {
    const config = STATUS_CONFIG[appointment.status] || STATUS_CONFIG.pending
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground">
                  {appointment.doctor?.user?.name || "Doctor"}
                </h3>
                <p className="text-sm text-muted-foreground">{appointment.doctor?.specialty}</p>
                <p className="text-sm font-medium text-foreground">
                  {appointment.pet?.name} ({appointment.pet?.breed})
                </p>
              </div>
            </div>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${config.color}`}
            >
              {config.label}
            </span>
          </div>

          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(appointment.appointmentDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{appointment.appointmentTime}</span>
            </div>
            {appointment.appointmentType && (
              <span className="inline-flex w-fit rounded bg-muted px-2 py-0.5 text-xs capitalize">
                {appointment.appointmentType}
              </span>
            )}
          </div>

          {/* Existing rating display */}
          {appointment.status === "completed" && appointment.rating?.value && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Your Rating:</span>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < appointment.rating.value
                        ? "fill-accent text-accent"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            {(appointment.status === "pending" || appointment.status === "accepted" || appointment.status === "confirmed") && (
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive bg-transparent"
                onClick={() => handleCancelAppointment(appointment._id)}
              >
                Cancel
              </Button>
            )}
            {isLiveTrackable(appointment.status) && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 bg-transparent"
                onClick={() => handleOpenTracking(appointment._id)}
              >
                <Navigation className="h-4 w-4 text-primary" />
                Track Doctor
              </Button>
            )}
            {appointment.status === "completed" && !appointment.rating?.value && (
              <Button
                size="sm"
                className="gap-1.5"
                onClick={() => handleOpenRating(appointment._id)}
              >
                <Star className="h-4 w-4" />
                Rate
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

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

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {!loading && (
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
                    Your scheduled appointments will appear here
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              filterAppointments("upcoming").map((apt) => (
                <AppointmentCard key={apt._id} appointment={apt} />
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {filterAppointments("past").length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No past appointments</CardTitle>
                  <CardDescription>
                    Completed and cancelled appointments will appear here
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              filterAppointments("past").map((apt) => (
                <AppointmentCard key={apt._id} appointment={apt} />
              ))
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {appointments.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No appointments yet</CardTitle>
                  <CardDescription>Book your first consultation to get started</CardDescription>
                </CardHeader>
              </Card>
            ) : (
              appointments.map((apt) => (
                <AppointmentCard key={apt._id} appointment={apt} />
              ))
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Rating Dialog */}
      <Dialog
        open={ratingDialog.open}
        onOpenChange={(open) => setRatingDialog({ ...ratingDialog, open })}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Rate Your Consultation</DialogTitle>
            <DialogDescription>How was your experience with this doctor?</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="flex justify-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setRatingValue(i + 1)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 ${
                      i < ratingValue ? "fill-accent text-accent" : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              {ratingValue === 0 && "Click to select a rating"}
              {ratingValue === 1 && "Poor"}
              {ratingValue === 2 && "Fair"}
              {ratingValue === 3 && "Good"}
              {ratingValue === 4 && "Very Good"}
              {ratingValue === 5 && "Excellent!"}
            </p>
            <Textarea
              placeholder="Write a review (optional)..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => setRatingDialog({ open: false, appointmentId: null })}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                disabled={!ratingValue || ratingSubmitting}
                onClick={handleSubmitRating}
              >
                {ratingSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Live Tracking Dialog */}
      <Dialog
        open={trackingDialog.open}
        onOpenChange={(open) => setTrackingDialog({ ...trackingDialog, open })}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-primary" />
              Live Tracking
            </DialogTitle>
            <DialogDescription>Real-time location of your vet</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {trackingLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : trackingDialog.data?.error ? (
              <p className="text-center text-sm text-destructive py-4">
                {trackingDialog.data.error}
              </p>
            ) : trackingDialog.data ? (
              <div className="space-y-3">
                <div className="rounded-lg bg-muted/50 p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium capitalize">
                      {STATUS_CONFIG[trackingDialog.data.status]?.label ||
                        trackingDialog.data.status}
                    </span>
                  </div>
                  {trackingDialog.data.tracking?.currentLocation?.coordinates?.length === 2 ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Longitude</span>
                        <span className="font-mono text-xs font-medium">
                          {trackingDialog.data.tracking.currentLocation.coordinates[0].toFixed(6)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Latitude</span>
                        <span className="font-mono text-xs font-medium">
                          {trackingDialog.data.tracking.currentLocation.coordinates[1].toFixed(6)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <p className="text-center text-muted-foreground italic text-xs pt-1">
                      Location not yet shared by doctor
                    </p>
                  )}
                  {trackingDialog.data.tracking?.acceptedAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Accepted At</span>
                      <span className="font-medium">
                        {new Date(trackingDialog.data.tracking.acceptedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                  {trackingDialog.data.tracking?.arrivedAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Arrived At</span>
                      <span className="font-medium">
                        {new Date(trackingDialog.data.tracking.arrivedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-1.5 bg-transparent"
                  onClick={() => handleOpenTracking(trackingDialog.data?._id)}
                >
                  <Activity className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
