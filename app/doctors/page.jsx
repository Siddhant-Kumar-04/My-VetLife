"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Star, MapPin, Clock, Filter, Stethoscope, Award, CheckCircle } from "lucide-react"

export default function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [specialty, setSpecialty] = useState("all")
  const [sortBy, setSortBy] = useState("rating")

  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Wilson",
      specialty: "General Veterinarian",
      qualifications: "DVM, MS",
      experience: "8 years",
      rating: 4.9,
      reviews: 124,
      location: "Manhattan, NY",
      availability: "Available Today",
      consultationFee: "$75",
      verified: true,
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Feline Specialist",
      qualifications: "DVM, ABVP (Feline)",
      experience: "12 years",
      rating: 4.8,
      reviews: 98,
      location: "Brooklyn, NY",
      availability: "Next Available: Tomorrow",
      consultationFee: "$90",
      verified: true,
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Canine Specialist",
      qualifications: "DVM, CVA",
      experience: "6 years",
      rating: 4.7,
      reviews: 76,
      location: "Queens, NY",
      availability: "Available Today",
      consultationFee: "$80",
      verified: true,
    },
    {
      id: 4,
      name: "Dr. James Brown",
      specialty: "Emergency Care",
      qualifications: "DVM, DACVECC",
      experience: "15 years",
      rating: 4.9,
      reviews: 156,
      location: "Bronx, NY",
      availability: "24/7 Emergency",
      consultationFee: "$120",
      verified: true,
    },
    {
      id: 5,
      name: "Dr. Lisa Park",
      specialty: "Dermatology",
      qualifications: "DVM, DACVD",
      experience: "10 years",
      rating: 4.6,
      reviews: 89,
      location: "Manhattan, NY",
      availability: "Next Available: Jan 26",
      consultationFee: "$95",
      verified: true,
    },
    {
      id: 6,
      name: "Dr. David Kim",
      specialty: "Orthopedic Surgery",
      qualifications: "DVM, DACVS",
      experience: "14 years",
      rating: 4.8,
      reviews: 112,
      location: "Brooklyn, NY",
      availability: "By Appointment",
      consultationFee: "$150",
      verified: true,
    },
  ]

  const filteredDoctors = doctors
    .filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSpecialty = specialty === "all" || doctor.specialty === specialty
      return matchesSearch && matchesSpecialty
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating
      if (sortBy === "reviews") return b.reviews - a.reviews
      if (sortBy === "experience") return parseInt(b.experience) - parseInt(a.experience)
      return 0
    })

  const specialties = [
    "General Veterinarian",
    "Feline Specialist",
    "Canine Specialist",
    "Emergency Care",
    "Dermatology",
    "Orthopedic Surgery",
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Find a Veterinarian</h1>
          <p className="mt-2 text-muted-foreground">
            Browse qualified veterinarians and book a home consultation
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={specialty} onValueChange={setSpecialty}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialties</SelectItem>
              {specialties.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Top Rated</SelectItem>
              <SelectItem value="reviews">Most Reviews</SelectItem>
              <SelectItem value="experience">Experience</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <p className="mb-6 text-sm text-muted-foreground">
          Showing {filteredDoctors.length} veterinarians
        </p>

        {/* Doctor Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="overflow-hidden transition-shadow hover:shadow-lg">
              <CardContent className="p-0">
                {/* Doctor Header */}
                <div className="bg-primary/5 p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <Stethoscope className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{doctor.name}</h3>
                        {doctor.verified && (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                      <p className="text-xs text-muted-foreground">{doctor.qualifications}</p>
                    </div>
                  </div>
                </div>

                {/* Doctor Details */}
                <div className="p-6 pt-4">
                  {/* Rating & Experience */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="font-medium text-foreground">{doctor.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({doctor.reviews} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Award className="h-4 w-4" />
                      {doctor.experience}
                    </div>
                  </div>

                  {/* Location & Availability */}
                  <div className="mb-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {doctor.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-medium text-primary">{doctor.availability}</span>
                    </div>
                  </div>

                  {/* Fee & Action */}
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Consultation Fee</span>
                      <p className="text-lg font-bold text-foreground">{doctor.consultationFee}</p>
                    </div>
                    <Button asChild>
                      <Link href={`/doctors/${doctor.id}`}>Book Now</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
