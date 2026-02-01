"use client"

import { useState, useEffect } from "react"
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
import { Search, Star, MapPin, Clock, Filter, Stethoscope, Award, CheckCircle, Loader2 } from "lucide-react"
import { api } from "@/lib/api"

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [specialty, setSpecialty] = useState("all")
  const [sortBy, setSortBy] = useState("rating")

  useEffect(() => {
    fetchDoctors()
  }, [specialty, sortBy])

  const fetchDoctors = async () => {
    try {
      setLoading(true)
      const params = {}
      if (specialty !== "all") params.specialty = specialty
      if (sortBy) params.sortBy = sortBy

      const response = await api.getDoctors(params)
      setDoctors(response.data || [])
    } catch (error) {
      console.error("Failed to fetch doctors:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredDoctors = doctors.filter((doctor) => {
    const doctorName = doctor.user?.name || ""
    const matchesSearch =
      doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
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

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredDoctors.length === 0 && (
          <div className="rounded-lg border border-border p-12 text-center">
            <Stethoscope className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No doctors found</h3>
            <p className="text-muted-foreground">Try adjusting your filters</p>
          </div>
        )}

        {/* Doctor Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor._id} className="overflow-hidden transition-shadow hover:shadow-lg">
              <CardContent className="p-0">
                {/* Doctor Header */}
                <div className="bg-primary/5 p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <Stethoscope className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{doctor.user?.name}</h3>
                        {doctor.isVerified && (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                      <p className="text-xs text-muted-foreground">
                        {doctor.qualifications?.[0]?.degree || "DVM"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Doctor Details */}
                <div className="p-6 pt-4">
                  {/* Rating & Experience */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="font-medium text-foreground">
                        {doctor.rating ? doctor.rating.toFixed(1) : "0.0"}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ({doctor.reviewCount || 0} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Award className="h-4 w-4" />
                      {doctor.experience || 0} years
                    </div>
                  </div>

                  {/* Location & Availability */}
                  <div className="mb-4 space-y-2 text-sm">
                    {(doctor.location?.city || doctor.location?.state) && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {doctor.location?.city}
                        {doctor.location?.city && doctor.location?.state && ", "}
                        {doctor.location?.state}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-medium text-primary">Available for booking</span>
                    </div>
                  </div>

                  {/* Fee & Action */}
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Consultation Fee</span>
                      <p className="text-lg font-bold text-foreground">
                        ${doctor.consultationFee || 0}
                      </p>
                    </div>
                    <Button asChild>
                      <Link href={`/doctors/${doctor._id}`}>Book Now</Link>
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
