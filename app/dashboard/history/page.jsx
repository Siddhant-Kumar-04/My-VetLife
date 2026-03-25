"use client"

import { useState, useEffect } from "react"
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Calendar,
  Clock,
  Search,
  Star,
  FileText,
  Filter,
  Loader2,
  Pill,
  Stethoscope,
} from "lucide-react"
import { api } from "@/lib/api"
import PrescriptionView from "@/components/PrescriptionView"

export default function HistoryPage() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPet, setFilterPet] = useState("all")
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      setLoading(true)
      const response = await api.getAppointments({ status: "completed" })
      setHistory(response.data || [])
    } catch (error) {
      console.error("Failed to fetch history:", error)
    } finally {
      setLoading(false)
    }
  }

  // Derive unique pet names from real data
  const pets = [...new Set(history.map((h) => h.pet?.name).filter(Boolean))]

  const formatDate = (dateString) => {
    if (!dateString) return "—"
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatMedications = (prescription) => {
    if (!prescription?.medications?.length) return null
    return prescription.medications
      .map(
        (m) =>
          `${m.name}${m.dosage ? ` (${m.dosage})` : ""}${m.duration ? ` for ${m.duration}` : ""}`
      )
      .join(", ")
  }

  const filteredHistory = history.filter((item) => {
    const doctorName = item.doctor?.user?.name || ""
    const diagnosis = item.notes?.diagnosis || item.notes?.doctorNotes || ""
    const petName = item.pet?.name || ""
    const matchesSearch =
      doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      petName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPet = filterPet === "all" || petName === filterPet
    return matchesSearch && matchesPet
  })

  const totalSpent = history.reduce((sum, r) => sum + (r.payment?.amount || 0), 0)
  const ratedHistory = history.filter((r) => r.rating?.value)
  const avgRating =
    ratedHistory.length
      ? (ratedHistory.reduce((sum, r) => sum + r.rating.value, 0) / ratedHistory.length).toFixed(1)
      : "—"

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
        </CardContent>
      </Card>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* History List */}
      {!loading && (
        <div className="space-y-4">
          {filteredHistory.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No records found</CardTitle>
                <CardDescription>
                  {history.length === 0
                    ? "You have no completed consultations yet."
                    : "Try adjusting your search or filter criteria."}
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            filteredHistory.map((record) => (
              <Card key={record._id}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    {/* Main Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {record.doctor?.user?.name || "Doctor"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {record.doctor?.specialty || "Veterinarian"}
                          </p>
                        </div>
                        {record.rating?.value ? (
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < record.rating.value
                                    ? "fill-accent text-accent"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">Not rated</span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {formatDate(record.appointmentDate)}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {record.appointmentTime || "—"}
                        </div>
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          {record.pet?.name} ({record.pet?.breed})
                        </span>
                      </div>

                      <div className="rounded-lg bg-muted/50 p-4 space-y-3">
                        {record.notes?.diagnosis && (
                          <div>
                            <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                              <Stethoscope className="h-4 w-4 text-primary" />
                              Diagnosis
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {record.notes.diagnosis}
                            </p>
                          </div>
                        )}
                        {record.notes?.doctorNotes && (
                          <div>
                            <p className="text-sm font-medium text-foreground">Doctor Notes</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {record.notes.doctorNotes}
                            </p>
                          </div>
                        )}
                        {formatMedications(record.prescription) && (
                          <div>
                            <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                              <Pill className="h-4 w-4 text-primary" />
                              Prescription
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {formatMedications(record.prescription)}
                            </p>
                          </div>
                        )}
                        {!record.notes?.diagnosis &&
                          !record.notes?.doctorNotes &&
                          !formatMedications(record.prescription) && (
                            <p className="text-sm text-muted-foreground italic">
                              No notes recorded
                            </p>
                          )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 lg:items-end">
                      {record.payment?.amount ? (
                        <p className="text-lg font-bold text-foreground">
                          ${record.payment.amount}
                        </p>
                      ) : null}
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 bg-transparent"
                        onClick={() => {
                          setSelectedRecord(record)
                          setDetailOpen(true)
                        }}
                      >
                        <FileText className="h-4 w-4" />
                        Full Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Summary */}
      {!loading && (
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
                <p className="text-2xl font-bold text-foreground">₹{totalSpent.toFixed(0)}</p>
                <p className="text-sm text-muted-foreground">Total Spent</p>
              </div>
              <div className="rounded-lg bg-muted p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{avgRating}</p>
                <p className="text-sm text-muted-foreground">Avg. Rating Given</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full Report Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Consultation Report</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-muted-foreground">Doctor</p>
                  <p className="font-medium">{selectedRecord.doctor?.user?.name || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Specialty</p>
                  <p className="font-medium">{selectedRecord.doctor?.specialty || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Pet</p>
                  <p className="font-medium">
                    {selectedRecord.pet?.name} ({selectedRecord.pet?.breed})
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {formatDate(selectedRecord.appointmentDate)} at {selectedRecord.appointmentTime}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p className="font-medium capitalize">
                    {selectedRecord.appointmentType || "consultation"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Fee Paid</p>
                  <p className="font-medium">
                    {selectedRecord.payment?.amount ? `₹${selectedRecord.payment.amount}` : "—"}
                  </p>
                </div>
              </div>

              {selectedRecord.notes?.diagnosis && (
                <div className="rounded-md bg-muted/50 p-3">
                  <p className="font-medium text-foreground mb-1">Diagnosis</p>
                  <p className="text-muted-foreground">{selectedRecord.notes.diagnosis}</p>
                </div>
              )}

              {selectedRecord.notes?.doctorNotes && (
                <div className="rounded-md bg-muted/50 p-3">
                  <p className="font-medium text-foreground mb-1">Doctor Notes</p>
                  <p className="text-muted-foreground">{selectedRecord.notes.doctorNotes}</p>
                </div>
              )}

              {selectedRecord.prescription?.medications?.length > 0 && (
                <div className="mt-4">
                  <PrescriptionView
                    prescription={selectedRecord.prescription}
                    appointment={selectedRecord}
                  />
                </div>
              )}

              {selectedRecord.rating?.value && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-muted-foreground">Your Rating:</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < selectedRecord.rating.value
                              ? "fill-accent text-accent"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {selectedRecord.rating.review && (
                    <p className="text-muted-foreground italic">
                      "{selectedRecord.rating.review}"
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
