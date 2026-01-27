"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
} from "lucide-react"
import Link from "next/link"

export default function DoctorProfilePage() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedPet, setSelectedPet] = useState("")
  const [notes, setNotes] = useState("")

  // Mock doctor data (in real app, fetch based on id)
  const doctor = {
    id: 1,
    name: "Dr. Sarah Wilson",
    specialty: "General Veterinarian",
    qualifications: "DVM, MS - Veterinary Medicine",
    experience: "8 years",
    rating: 4.9,
    reviews: 124,
    location: "Manhattan, New York",
    address: "123 Pet Care Street, Manhattan, NY 10001",
    phone: "+1 (555) 123-4567",
    email: "dr.wilson@vetic.com",
    consultationFee: "$75",
    verified: true,
    about:
      "Dr. Sarah Wilson is a passionate veterinarian with over 8 years of experience in small animal medicine. She specializes in preventive care, diagnostics, and treatment of dogs and cats. Dr. Wilson believes in providing compassionate, fear-free care to all her patients.",
    education: [
      "Doctor of Veterinary Medicine - Cornell University",
      "MS in Veterinary Sciences - UC Davis",
      "Board Certified in Small Animal Practice",
    ],
    services: [
      "General Health Checkups",
      "Vaccinations",
      "Diagnostic Testing",
      "Preventive Care",
      "Minor Surgeries",
      "Dental Care",
    ],
  }

  const availableDates = [
    { value: "2026-01-25", label: "Sat, Jan 25" },
    { value: "2026-01-26", label: "Sun, Jan 26" },
    { value: "2026-01-27", label: "Mon, Jan 27" },
    { value: "2026-01-28", label: "Tue, Jan 28" },
    { value: "2026-01-29", label: "Wed, Jan 29" },
  ]

  const availableSlots = [
    { value: "09:00", label: "9:00 AM" },
    { value: "10:00", label: "10:00 AM" },
    { value: "11:00", label: "11:00 AM" },
    { value: "14:00", label: "2:00 PM" },
    { value: "15:00", label: "3:00 PM" },
    { value: "16:00", label: "4:00 PM" },
  ]

  const pets = [
    { value: "1", label: "Max (Golden Retriever)" },
    { value: "2", label: "Luna (Persian Cat)" },
    { value: "3", label: "Buddy (Labrador)" },
  ]

  const reviews = [
    {
      id: 1,
      name: "John D.",
      rating: 5,
      date: "Jan 15, 2026",
      comment:
        "Dr. Wilson was amazing with my nervous puppy. She took the time to make him comfortable and explained everything clearly.",
    },
    {
      id: 2,
      name: "Emily R.",
      rating: 5,
      date: "Jan 10, 2026",
      comment:
        "Very professional and caring. Highly recommend for anyone looking for a vet who genuinely cares about animals.",
    },
    {
      id: 3,
      name: "Michael S.",
      rating: 4,
      date: "Jan 5, 2026",
      comment:
        "Great experience overall. The home visit was convenient and thorough.",
    },
  ]

  const handleBooking = () => {
    if (selectedDate && selectedTime && selectedPet) {
      router.push("/dashboard/appointments")
    }
  }

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
          {/* Doctor Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col gap-6 sm:flex-row">
                  <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-primary/10">
                    <Stethoscope className="h-16 w-16 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold text-foreground">{doctor.name}</h1>
                      {doctor.verified && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <p className="text-muted-foreground">{doctor.specialty}</p>
                    <p className="text-sm text-muted-foreground">{doctor.qualifications}</p>

                    <div className="mt-4 flex flex-wrap gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-accent text-accent" />
                        <span className="font-semibold text-foreground">{doctor.rating}</span>
                        <span className="text-muted-foreground">({doctor.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Award className="h-5 w-5" />
                        {doctor.experience} experience
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {doctor.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {doctor.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {doctor.email}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{doctor.about}</p>
              </CardContent>
            </Card>

            {/* Education & Certifications */}
            <Card>
              <CardHeader>
                <CardTitle>Education & Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {doctor.education.map((edu) => (
                    <li key={edu} className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">{edu}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle>Services Offered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {doctor.services.map((service) => (
                    <span
                      key={service}
                      className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Reviews</CardTitle>
                <CardDescription>
                  What pet owners are saying about {doctor.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <span className="font-semibold text-primary">
                            {review.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{review.name}</p>
                          <p className="text-xs text-muted-foreground">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "fill-accent text-accent"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Book a Consultation</CardTitle>
                <CardDescription>Schedule a home visit with {doctor.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Fee Display */}
                <div className="rounded-lg bg-primary/5 p-4 text-center">
                  <p className="text-sm text-muted-foreground">Consultation Fee</p>
                  <p className="text-3xl font-bold text-primary">{doctor.consultationFee}</p>
                </div>

                {/* Select Pet */}
                <div className="space-y-2">
                  <Label>Select Pet</Label>
                  <Select value={selectedPet} onValueChange={setSelectedPet}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your pet" />
                    </SelectTrigger>
                    <SelectContent>
                      {pets.map((pet) => (
                        <SelectItem key={pet.value} value={pet.value}>
                          {pet.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Select Date */}
                <div className="space-y-2">
                  <Label>Select Date</Label>
                  <Select value={selectedDate} onValueChange={setSelectedDate}>
                    <SelectTrigger>
                      <Calendar className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Choose a date" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDates.map((date) => (
                        <SelectItem key={date.value} value={date.value}>
                          {date.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Select Time */}
                <div className="space-y-2">
                  <Label>Select Time</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <Clock className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Choose a time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSlots.map((slot) => (
                        <SelectItem key={slot.value} value={slot.value}>
                          {slot.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label>Notes (Optional)</Label>
                  <Textarea
                    placeholder="Describe your pet's symptoms or concerns..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Book Button */}
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleBooking}
                  disabled={!selectedDate || !selectedTime || !selectedPet}
                >
                  Confirm Booking
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
