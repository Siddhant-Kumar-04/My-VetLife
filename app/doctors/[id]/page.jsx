"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  Award,
  CheckCircle,
  Stethoscope,
  Calendar,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/AuthContext"

export default function DoctorProfilePage() {
  const { id } = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  // ── Doctor data ──────────────────────────────────────────
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ── User's pets ──────────────────────────────────────────
  const [pets, setPets] = useState([])
  const [petsLoading, setPetsLoading] = useState(false)

  // ── Booking form ─────────────────────────────────────────
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedPet, setSelectedPet] = useState("")
  const [reason, setReason] = useState("")
  const [notes, setNotes] = useState("")
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState(null)
  const [bookingSuccess, setBookingSuccess] = useState(false)

  // ── Fetch doctor on mount ────────────────────────────────
  useEffect(() => {
    if (id) fetchDoctor()
  }, [id])

  // ── Fetch pets when authenticated ────────────────────────
  useEffect(() => {
    if (isAuthenticated) fetchPets()
  }, [isAuthenticated])

  const fetchDoctor = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.getDoctor(id)
      setDoctor(response.data)
    } catch (err) {
      setError(err.message || "Failed to load doctor details")
    } finally {
      setLoading(false)
    }
  }

  const fetchPets = async () => {
    try {
      setPetsLoading(true)
      const response = await api.getPets()
      setPets(response.data || [])
    } catch (err) {
      console.error("Failed to fetch pets:", err)
    } finally {
      setPetsLoading(false)
    }
  }

  // ── Build available dates (next 14 days) from doctor schedule ──
  const getAvailableDates = () => {
    if (!doctor?.availability) return []
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const dates = []
    for (let i = 1; i <= 14; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      const dayName = dayNames[date.getDay()]
      if (doctor.availability[dayName]?.available) {
        const y = date.getFullYear()
        const m = (date.getMonth() + 1).toString().padStart(2, "0")
        const d = date.getDate().toString().padStart(2, "0")
        dates.push({
          value: `${y}-${m}-${d}`,
          label: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        })
      }
    }
    return dates
  }

  // ── Build 30-min time slots for selected date ────────────
  const getTimeSlots = () => {
    if (!doctor?.availability || !selectedDate) return []
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    // Use T12:00:00 to avoid UTC-offset shifting the date
    const date = new Date(selectedDate + "T12:00:00")
    const dayName = dayNames[date.getDay()]
    const sched = doctor.availability[dayName]
    if (!sched?.available || !sched.start || !sched.end) return []

    const [startH, startM] = sched.start.split(":").map(Number)
    const [endH, endM] = sched.end.split(":").map(Number)
    const slots = []
    let h = startH, m = startM

    while (h < endH || (h === endH && m < endM)) {
      const h12 = h % 12 === 0 ? 12 : h % 12
      const ampm = h < 12 ? "AM" : "PM"
      const label = `${h12}:${m.toString().padStart(2, "0")} ${ampm}`
      slots.push({ value: label, label })
      m += 30
      if (m >= 60) { m = 0; h++ }
    }
    return slots
  }

  // ── Booking handler ──────────────────────────────────────
  const handleBooking = async () => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }
    if (!selectedPet || !selectedDate || !selectedTime || !reason.trim()) {
      setBookingError("Please fill in all required fields")
      return
    }
    try {
      setBookingLoading(true)
      setBookingError(null)
      await api.createAppointment({
        doctor: doctor._id,
        pet: selectedPet,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        reason: reason.trim() + (notes.trim() ? `\n\nNotes: ${notes.trim()}` : ""),
        consultationType: "home-visit",
      })
      setBookingSuccess(true)
      setTimeout(() => router.push("/dashboard/appointments"), 2000)
    } catch (err) {
      setBookingError(err.message || "Failed to book appointment. Please try again.")
    } finally {
      setBookingLoading(false)
    }
  }


  // ── Loading ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    )
  }

  // ── Error / not found ────────────────────────────────────
  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <Link
            href="/doctors"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Doctors
          </Link>
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
            <h3 className="mt-4 text-lg font-semibold">Doctor not found</h3>
            <p className="mt-1 text-muted-foreground">{error || "This doctor does not exist."}</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const availableDates = getAvailableDates()
  const timeSlots = getTimeSlots()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Back Button */}
        <Link
          href="/doctors"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Doctors
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* ── Doctor Info (left 2/3) ─────────────────────── */}
          <div className="space-y-6 lg:col-span-2">

            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col gap-6 sm:flex-row">
                  <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                    <Stethoscope className="h-16 w-16 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold text-foreground">{doctor.user?.name}</h1>
                      {doctor.isVerified && <CheckCircle className="h-5 w-5 text-primary" />}
                    </div>
                    <p className="text-muted-foreground">{doctor.specialty}</p>
                    {doctor.qualifications?.[0] && (
                      <p className="text-sm text-muted-foreground">
                        {doctor.qualifications[0].degree}
                        {doctor.qualifications[0].institution && ` – ${doctor.qualifications[0].institution}`}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-accent text-accent" />
                        <span className="font-semibold text-foreground">
                          {doctor.rating?.toFixed(1) || "0.0"}
                        </span>
                        <span className="text-muted-foreground">
                          ({doctor.reviewCount || 0} reviews)
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Award className="h-5 w-5" />
                        {doctor.experience || 0} yrs experience
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {(doctor.location?.city || doctor.location?.state) && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {[doctor.location?.city, doctor.location?.state].filter(Boolean).join(", ")}
                        </div>
                      )}
                      {doctor.user?.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {doctor.user.phone}
                        </div>
                      )}
                      {doctor.user?.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {doctor.user.email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About */}
            {doctor.bio && (
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed text-muted-foreground">{doctor.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* Education & Certifications */}
            {doctor.qualifications?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Education & Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {doctor.qualifications.map((q, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">
                          {q.degree}
                          {q.institution && ` – ${q.institution}`}
                          {q.year && `, ${q.year}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Weekly Availability */}
            {doctor.availability && (
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {Object.entries(doctor.availability).map(([day, s]) => (
                      <div
                        key={day}
                        className={`rounded-lg p-3 text-center text-sm ${
                          s.available
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <p className="font-medium capitalize">{day}</p>
                        {s.available ? (
                          <p className="text-xs">{s.start} – {s.end}</p>
                        ) : (
                          <p className="text-xs">Off</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* ── Booking Card (right 1/3) ───────────────────── */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Book a Consultation</CardTitle>
                <CardDescription>Home visit with {doctor.user?.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">

                {/* Success banner */}
                {bookingSuccess && (
                  <div className="rounded-lg bg-primary/10 p-4 text-center">
                    <CheckCircle className="mx-auto h-6 w-6 text-primary" />
                    <p className="mt-2 font-medium text-primary">Booking Confirmed!</p>
                    <p className="text-sm text-muted-foreground">
                      Redirecting to your appointments…
                    </p>
                  </div>
                )}

                {/* Error banner */}
                {bookingError && (
                  <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                    <p className="text-sm text-destructive">{bookingError}</p>
                  </div>
                )}

                {/* Fee */}
                <div className="rounded-lg bg-primary/5 p-4 text-center">
                  <p className="text-sm text-muted-foreground">Consultation Fee</p>
                  <p className="text-3xl font-bold text-primary">₹{doctor.consultationFee || 0}</p>
                </div>

                {/* Login nudge */}
                {!isAuthenticated && (
                  <div className="rounded-lg border border-accent/50 bg-accent/10 p-3 text-sm">
                    <Link href="/login" className="font-medium text-primary underline">
                      Login
                    </Link>{" "}
                    to book an appointment
                  </div>
                )}

                {/* Select Pet */}
                <div className="space-y-1.5">
                  <Label>
                    Select Pet <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={selectedPet}
                    onValueChange={setSelectedPet}
                    disabled={!isAuthenticated || bookingSuccess}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          petsLoading
                            ? "Loading pets…"
                            : pets.length === 0
                            ? "No pets found"
                            : "Choose your pet"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {pets.map((p) => (
                        <SelectItem key={p._id} value={p._id}>
                          {p.name} ({p.breed || p.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isAuthenticated && !petsLoading && pets.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      <Link href="/dashboard/pets" className="text-primary underline">
                        Add a pet
                      </Link>{" "}
                      first to book an appointment
                    </p>
                  )}
                </div>

                {/* Select Date */}
                <div className="space-y-1.5">
                  <Label>
                    Select Date <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={selectedDate}
                    onValueChange={(v) => {
                      setSelectedDate(v)
                      setSelectedTime("")
                    }}
                    disabled={!isAuthenticated || bookingSuccess}
                  >
                    <SelectTrigger>
                      <Calendar className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Choose a date" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDates.length === 0 ? (
                        <SelectItem value="_none" disabled>
                          No available dates in next 14 days
                        </SelectItem>
                      ) : (
                        availableDates.map((d) => (
                          <SelectItem key={d.value} value={d.value}>
                            {d.label}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Select Time */}
                <div className="space-y-1.5">
                  <Label>
                    Select Time <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={selectedTime}
                    onValueChange={setSelectedTime}
                    disabled={!isAuthenticated || !selectedDate || bookingSuccess}
                  >
                    <SelectTrigger>
                      <Clock className="mr-2 h-4 w-4" />
                      <SelectValue
                        placeholder={!selectedDate ? "Select a date first" : "Choose a time"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Reason for Visit */}
                <div className="space-y-1.5">
                  <Label>
                    Reason for Visit <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder="e.g., Annual checkup, Vaccination…"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    disabled={!isAuthenticated || bookingSuccess}
                  />
                </div>

                {/* Symptoms / Notes */}
                <div className="space-y-1.5">
                  <Label>
                    Symptoms / Notes{" "}
                    <span className="text-xs text-muted-foreground">(optional)</span>
                  </Label>
                  <Textarea
                    placeholder="Describe any symptoms or additional concerns…"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    disabled={!isAuthenticated || bookingSuccess}
                  />
                </div>

                {/* Submit */}
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleBooking}
                  disabled={
                    bookingLoading ||
                    bookingSuccess ||
                    !isAuthenticated ||
                    !selectedPet ||
                    !selectedDate ||
                    !selectedTime ||
                    !reason.trim()
                  }
                >
                  {bookingLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Booking…
                    </>
                  ) : (
                    "Confirm Booking"
                  )}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  You can cancel or reschedule up to 24 hours before the appointment
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
