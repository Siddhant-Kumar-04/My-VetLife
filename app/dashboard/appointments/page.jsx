"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import dynamic from "next/dynamic"
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
  Loader2,
  Navigation,
  MapPin,
  Wifi,
  WifiOff,
  RefreshCw,
} from "lucide-react"
import { api } from "@/lib/api"

// Leaflet map — client-only (no SSR)
const LiveTrackingMap = dynamic(
  () => import("@/components/LiveTrackingMap"),
  { ssr: false, loading: () => <div className="h-65 w-full animate-pulse rounded-xl bg-muted" /> }
)

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"

const STATUS_CONFIG = {
  pending:       { color: "bg-accent/50 text-accent-foreground",  label: "Pending" },
  confirmed:     { color: "bg-blue-100 text-blue-700",             label: "Accepted" },
  accepted:      { color: "bg-blue-100 text-blue-700",             label: "Accepted" },
  "on-the-way":  { color: "bg-orange-100 text-orange-700",         label: "On The Way" },
  arrived:       { color: "bg-yellow-100 text-yellow-700",         label: "Arrived" },
  "in-progress": { color: "bg-purple-100 text-purple-700",         label: "In Progress" },
  completed:     { color: "bg-primary/10 text-primary",            label: "Completed" },
  cancelled:     { color: "bg-destructive/10 text-destructive",    label: "Cancelled" },
}

export default function AppointmentsPage() {
  // ── Core state ──────────────────────────────────────────────────────────────
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  // ── Rating dialog ────────────────────────────────────────────────────────────
  const [ratingDialog, setRatingDialog] = useState({ open: false, appointmentId: null })
  const [ratingValue, setRatingValue] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [ratingSubmitting, setRatingSubmitting] = useState(false)

  // ── Live tracking dialog ──────────────────────────────────────────────────────
  const [trackingDialog, setTrackingDialog] = useState({
    open: false,
    appointmentId: null,
    doctorName: "",
  })
  const [trackingLoading, setTrackingLoading] = useState(false)
  const [liveLocation, setLiveLocation]   = useState(null)   // { lat, lng, updatedAt }
  const [liveStatus, setLiveStatus]       = useState(null)
  const [socketConnected, setSocketConnected] = useState(false)

  const socketRef  = useRef(null)
  const pollingRef = useRef(null)

  // ── Socket lifecycle ──────────────────────────────────────────────────────────
  useEffect(() => {
    let socket
    import("socket.io-client").then(({ io }) => {
      socket = io(SOCKET_URL, {
        transports: ["websocket", "polling"],
        reconnectionAttempts: 5,
      })
      socketRef.current = socket

      socket.on("connect",    () => setSocketConnected(true))
      socket.on("disconnect", () => setSocketConnected(false))

      socket.on("tracking-data", (data) => {
        setLiveLocation({
          lat: data.latitude,
          lng: data.longitude,
          updatedAt: data.updatedAt,
        })
      })

      socket.on("appointment-status", (data) => {
        setLiveStatus(data.status)
        setAppointments((prev) =>
          prev.map((a) =>
            a._id === data.appointmentId ? { ...a, status: data.status } : a
          )
        )
      })
    })

    return () => socket?.disconnect()
  }, [])

  // ── Appointments fetch ────────────────────────────────────────────────────────
  useEffect(() => {
    fetchAppointments()
    // Auto-refresh every 10s so Track Doctor button appears when doctor changes status
    const interval = setInterval(fetchAppointments, 10000)
    return () => clearInterval(interval)
  }, [])

  const [refreshing, setRefreshing] = useState(false)

  const fetchAppointments = async (silent = false) => {
    try {
      if (!silent) setLoading(true)
      else setRefreshing(true)
      const response = await api.getAppointments()
      setAppointments(response.data || [])
    } catch (error) {
      console.error("Failed to fetch appointments:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleCancelAppointment = async (id) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return
    try {
      await api.cancelAppointment(id, "Cancelled by user")
      await fetchAppointments(true)
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
      await fetchAppointments(true)
    } catch (error) {
      console.error("Failed to rate appointment:", error)
    } finally {
      setRatingSubmitting(false)
    }
  }

  const handleOpenTracking = useCallback(async (appointment) => {
    // Clear any previous session
    clearInterval(pollingRef.current)
    setLiveLocation(null)
    setLiveStatus(null)
    setTrackingLoading(true)
    setTrackingDialog({
      open: true,
      appointmentId: appointment._id,
      doctorName: appointment.doctor?.user?.name || "Doctor",
    })

    // Join socket room
    if (socketRef.current?.connected) {
      socketRef.current.emit("join-tracking", appointment._id)
    }

    // Seed with last known REST location
    try {
      const res = await api.getLiveTracking(appointment._id)
      const coords = res.data?.tracking?.liveLocation?.coordinates
      // Only set if real coords (not 0,0 placeholder)
      if (coords?.length === 2 && !(coords[0] === 0 && coords[1] === 0)) {
        setLiveLocation({ lat: coords[1], lng: coords[0], updatedAt: null })
      }
      setLiveStatus(res.data?.status || null)
    } catch (err) {
      console.error("Failed to seed tracking data:", err)
    } finally {
      setTrackingLoading(false)
    }

    // 8-second polling fallback (only fills in if socket hasn't given a fresher update)
    pollingRef.current = setInterval(async () => {
      try {
        const r = await api.getLiveTracking(appointment._id)
        const c = r.data?.tracking?.liveLocation?.coordinates
        if (c?.length === 2 && !(c[0] === 0 && c[1] === 0)) {
          setLiveLocation((prev) =>
            prev?.updatedAt ? prev : { lat: c[1], lng: c[0], updatedAt: null }
          )
        }
      } catch (_) { /* silent */ }
    }, 8000)
  }, [])

  const handleCloseTracking = useCallback(() => {
    if (socketRef.current && trackingDialog.appointmentId) {
      socketRef.current.emit("leave-tracking", trackingDialog.appointmentId)
    }
    clearInterval(pollingRef.current)
    setTrackingDialog({ open: false, appointmentId: null, doctorName: "" })
    setLiveLocation(null)
    setLiveStatus(null)
  }, [trackingDialog.appointmentId])

  const handleRefreshTracking = useCallback(async () => {
    if (!trackingDialog.appointmentId) return
    try {
      const res = await api.getLiveTracking(trackingDialog.appointmentId)
      const coords = res.data?.tracking?.liveLocation?.coordinates
      if (coords?.length === 2) {
        setLiveLocation({ lat: coords[1], lng: coords[0], updatedAt: null })
      }
      setLiveStatus(res.data?.status || null)
    } catch (err) {
      console.error("Refresh failed:", err)
    }
  }, [trackingDialog.appointmentId])

  // ── Helpers ───────────────────────────────────────────────────────────────────
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })

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

  // ── Appointment card ──────────────────────────────────────────────────────────
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
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${config.color}`}>
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
            {["pending", "accepted", "confirmed"].includes(appointment.status) && (
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
                onClick={() => handleOpenTracking(appointment)}
              >
                <Navigation className="h-4 w-4 text-primary" />
                Track Doctor
              </Button>
            )}
            {appointment.status === "completed" && !appointment.rating?.value && (
              <Button size="sm" className="gap-1.5" onClick={() => handleOpenRating(appointment._id)}>
                <Star className="h-4 w-4" />
                Rate
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
          <p className="text-muted-foreground">View and manage your appointments</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 bg-transparent"
            onClick={() => fetchAppointments(true)}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button asChild>
            <Link href="/doctors">Book New Appointment</Link>
          </Button>
        </div>
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
                  <CardDescription>Your scheduled appointments will appear here</CardDescription>
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
                  <CardDescription>Completed and cancelled appointments will appear here</CardDescription>
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

      {/* ── Rating Dialog ──────────────────────────────────────────────────── */}
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
                {ratingSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Live Tracking Dialog ───────────────────────────────────────────── */}
      <Dialog open={trackingDialog.open} onOpenChange={(open) => { if (!open) handleCloseTracking() }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-primary" />
              Live Tracking
              {/* Connection pill */}
              <span
                className={`ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  socketConnected
                    ? "bg-green-100 text-green-700"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {socketConnected ? (
                  <><Wifi className="h-3 w-3" /> Live</>
                ) : (
                  <><WifiOff className="h-3 w-3" /> Polling</>
                )}
              </span>
            </DialogTitle>
            <DialogDescription>
              {trackingDialog.doctorName
                ? `Tracking ${trackingDialog.doctorName.startsWith("Dr.") ? "" : "Dr. "}${trackingDialog.doctorName}`
                : "Real-time location of your vet"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-1">
            {trackingLoading ? (
              <div className="flex h-65 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : liveLocation && !(liveLocation.lat === 0 && liveLocation.lng === 0) ? (
              <>
                {/* Leaflet map */}
                <div className="overflow-hidden rounded-xl border border-border">
                  <LiveTrackingMap
                    latitude={liveLocation.lat}
                    longitude={liveLocation.lng}
                    doctorName={trackingDialog.doctorName}
                  />
                </div>

                {/* Info row */}
                <div className="rounded-lg bg-muted/50 px-4 py-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {liveLocation.lat.toFixed(5)}, {liveLocation.lng.toFixed(5)}
                      </span>
                    </div>
                    {liveStatus && (
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          STATUS_CONFIG[liveStatus]?.color || "bg-muted text-muted-foreground"
                        }`}
                      >
                        {STATUS_CONFIG[liveStatus]?.label || liveStatus}
                      </span>
                    )}
                  </div>
                  {liveLocation.updatedAt && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Updated {new Date(liveLocation.updatedAt).toLocaleTimeString()}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1.5 bg-transparent"
                    onClick={handleRefreshTracking}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 gap-1.5"
                    asChild
                  >
                    <a
                      href={`https://www.google.com/maps?q=${liveLocation.lat},${liveLocation.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin className="h-4 w-4" />
                      Open in Maps
                    </a>
                  </Button>
                </div>
              </>
            ) : (
              /* Waiting placeholder */
              <div className="flex h-65 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                  <Navigation className="h-7 w-7 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Waiting for location</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Doctor hasn&apos;t started sharing yet
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 bg-transparent"
                  onClick={handleRefreshTracking}
                >
                  <RefreshCw className="h-4 w-4" />
                  Check again
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
