"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Calendar,
  Clock,
  Search,
  Star,
  FileText,
  Download,
  Filter,
} from "lucide-react"

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPet, setFilterPet] = useState("all")

  const history = [
    {
      id: 1,
      doctor: "Dr. Sarah Wilson",
      specialty: "General Veterinarian",
      pet: "Max",
      petType: "Golden Retriever",
      date: "Jan 15, 2026",
      time: "10:00 AM",
      diagnosis: "Annual wellness checkup - All vitals normal",
      prescription: "Heartworm prevention medication",
      rating: 5,
      fee: "$75",
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "Feline Specialist",
      pet: "Luna",
      petType: "Persian Cat",
      date: "Jan 10, 2026",
      time: "2:30 PM",
      diagnosis: "Mild respiratory infection",
      prescription: "Antibiotics for 7 days",
      rating: 5,
      fee: "$90",
    },
    {
      id: 3,
      doctor: "Dr. Emily Rodriguez",
      specialty: "General Veterinarian",
      pet: "Buddy",
      petType: "Labrador",
      date: "Dec 20, 2025",
      time: "11:00 AM",
      diagnosis: "Skin allergy - Seasonal",
      prescription: "Antihistamines and medicated shampoo",
      rating: 4,
      fee: "$80",
    },
    {
      id: 4,
      doctor: "Dr. James Brown",
      specialty: "Emergency Care",
      pet: "Max",
      petType: "Golden Retriever",
      date: "Nov 15, 2025",
      time: "6:00 PM",
      diagnosis: "Minor paw injury",
      prescription: "Wound care and pain medication",
      rating: 5,
      fee: "$120",
    },
    {
      id: 5,
      doctor: "Dr. Lisa Park",
      specialty: "Dermatology",
      pet: "Luna",
      petType: "Persian Cat",
      date: "Oct 28, 2025",
      time: "3:00 PM",
      diagnosis: "Routine vaccination",
      prescription: "No medication needed",
      rating: 5,
      fee: "$60",
    },
  ]

  const pets = ["Max", "Luna", "Buddy"]

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pet.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPet = filterPet === "all" || item.pet === filterPet
    return matchesSearch && matchesPet
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Consultation History</h1>
        <p className="text-muted-foreground">View past appointments and medical records</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by doctor, diagnosis, or pet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterPet} onValueChange={setFilterPet}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by pet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Pets</SelectItem>
              {pets.map((pet) => (
                <SelectItem key={pet} value={pet}>
                  {pet}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </CardContent>
      </Card>

      {/* History List */}
      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No records found</CardTitle>
              <CardDescription>
                Try adjusting your search or filter criteria
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          filteredHistory.map((record) => (
            <Card key={record.id}>
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  {/* Main Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{record.doctor}</h3>
                        <p className="text-sm text-muted-foreground">{record.specialty}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < record.rating
                                ? "fill-accent text-accent"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {record.date}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {record.time}
                      </div>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {record.pet} ({record.petType})
                      </span>
                    </div>

                    <div className="rounded-lg bg-muted/50 p-4">
                      <p className="text-sm font-medium text-foreground">Diagnosis</p>
                      <p className="mt-1 text-sm text-muted-foreground">{record.diagnosis}</p>
                      {record.prescription && (
                        <>
                          <p className="mt-3 text-sm font-medium text-foreground">Prescription</p>
                          <p className="mt-1 text-sm text-muted-foreground">{record.prescription}</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 lg:items-end">
                    <p className="text-lg font-bold text-foreground">{record.fee}</p>
                    <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                      <FileText className="h-4 w-4" />
                      View Full Report
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Download className="h-4 w-4" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-primary/5 p-4 text-center">
              <p className="text-2xl font-bold text-primary">{history.length}</p>
              <p className="text-sm text-muted-foreground">Total Consultations</p>
            </div>
            <div className="rounded-lg bg-accent/20 p-4 text-center">
              <p className="text-2xl font-bold text-foreground">
                ${history.reduce((sum, r) => sum + parseInt(r.fee.replace("$", "")), 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Spent</p>
            </div>
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="text-2xl font-bold text-foreground">
                {(history.reduce((sum, r) => sum + r.rating, 0) / history.length).toFixed(1)}
              </p>
              <p className="text-sm text-muted-foreground">Avg. Rating Given</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
