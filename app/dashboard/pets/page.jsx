"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dog,
  Cat,
  Plus,
  Calendar,
  Syringe,
  FileText,
  Edit,
  Trash2,
  Loader2,
  Stethoscope,
  Activity,
} from "lucide-react"
import { api } from "@/lib/api"

const BLANK_PET = {
  name: "",
  type: "dog",
  breed: "",
  gender: "male",
  color: "",
  age: { years: 0, months: 0 },
  weight: { value: 0, unit: "kg" },
}

// Reusable form fields for add / edit
function PetFormFields({ pet, setPet }) {
  return (
    <div className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label>Pet Name *</Label>
        <Input
          placeholder="Enter pet name"
          value={pet.name}
          onChange={(e) => setPet({ ...pet, name: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={pet.type} onValueChange={(v) => setPet({ ...pet, type: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dog">Dog</SelectItem>
              <SelectItem value="cat">Cat</SelectItem>
              <SelectItem value="bird">Bird</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Gender</Label>
          <Select value={pet.gender || "male"} onValueChange={(v) => setPet({ ...pet, gender: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Breed *</Label>
        <Input
          placeholder="Enter breed"
          value={pet.breed}
          onChange={(e) => setPet({ ...pet, breed: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Color</Label>
        <Input
          placeholder="e.g. Golden, Black & White"
          value={pet.color || ""}
          onChange={(e) => setPet({ ...pet, color: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Age (Years)</Label>
          <Input
            type="number"
            min={0}
            value={pet.age?.years || 0}
            onChange={(e) =>
              setPet({ ...pet, age: { ...pet.age, years: parseInt(e.target.value) || 0 } })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Age (Months)</Label>
          <Input
            type="number"
            min={0}
            max={11}
            value={pet.age?.months || 0}
            onChange={(e) =>
              setPet({ ...pet, age: { ...pet.age, months: parseInt(e.target.value) || 0 } })
            }
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Weight (kg)</Label>
        <Input
          type="number"
          min={0}
          step={0.1}
          value={pet.weight?.value || 0}
          onChange={(e) =>
            setPet({ ...pet, weight: { ...pet.weight, value: parseFloat(e.target.value) || 0 } })
          }
        />
      </div>
    </div>
  )
}

export default function PetsPage() {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)

  // Add dialog
  const [addOpen, setAddOpen] = useState(false)
  const [newPet, setNewPet] = useState(BLANK_PET)
  const [addSubmitting, setAddSubmitting] = useState(false)

  // Edit dialog
  const [editOpen, setEditOpen] = useState(false)
  const [editingPet, setEditingPet] = useState(null)
  const [editSubmitting, setEditSubmitting] = useState(false)

  // Medical records dialog
  const [recordsOpen, setRecordsOpen] = useState(false)
  const [viewingPet, setViewingPet] = useState(null)

  useEffect(() => {
    fetchPets()
  }, [])

  const fetchPets = async () => {
    try {
      setLoading(true)
      const response = await api.getPets()
      setPets(response.data || [])
    } catch (error) {
      console.error("Failed to fetch pets:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddPet = async () => {
    if (!newPet.name || !newPet.breed) return
    try {
      setAddSubmitting(true)
      await api.createPet(newPet)
      await fetchPets()
      setNewPet(BLANK_PET)
      setAddOpen(false)
    } catch (error) {
      console.error("Failed to create pet:", error)
    } finally {
      setAddSubmitting(false)
    }
  }

  const handleOpenEdit = (pet) => {
    setEditingPet({
      ...pet,
      age: pet.age || { years: 0, months: 0 },
      weight: pet.weight || { value: 0, unit: "kg" },
      gender: pet.gender || "male",
      color: pet.color || "",
    })
    setEditOpen(true)
  }

  const handleEditPet = async () => {
    if (!editingPet?.name || !editingPet?.breed) return
    try {
      setEditSubmitting(true)
      await api.updatePet(editingPet._id, {
        name: editingPet.name,
        type: editingPet.type,
        breed: editingPet.breed,
        gender: editingPet.gender,
        color: editingPet.color,
        age: editingPet.age,
        weight: editingPet.weight,
      })
      await fetchPets()
      setEditOpen(false)
      setEditingPet(null)
    } catch (error) {
      console.error("Failed to update pet:", error)
    } finally {
      setEditSubmitting(false)
    }
  }

  const handleDeletePet = async (id) => {
    if (!confirm("Are you sure you want to delete this pet?")) return
    try {
      await api.deletePet(id)
      setPets(pets.filter((pet) => pet._id !== id))
    } catch (error) {
      console.error("Failed to delete pet:", error)
    }
  }

  const handleViewRecords = (pet) => {
    setViewingPet(pet)
    setRecordsOpen(true)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "—"
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getPetIcon = (type) => (type === "cat" ? Cat : Dog)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Pets</h1>
          <p className="text-muted-foreground">Manage your pet profiles and health records</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Pet
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Pet</DialogTitle>
              <DialogDescription>
                Enter your pet&apos;s details to create a new profile
              </DialogDescription>
            </DialogHeader>
            <PetFormFields pet={newPet} setPet={setNewPet} />
            <Button onClick={handleAddPet} className="w-full mt-2" disabled={addSubmitting}>
              {addSubmitting ? "Adding..." : "Add Pet"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Pet</DialogTitle>
            <DialogDescription>Update {editingPet?.name}&apos;s details</DialogDescription>
          </DialogHeader>
          {editingPet && <PetFormFields pet={editingPet} setPet={setEditingPet} />}
          <Button onClick={handleEditPet} className="w-full mt-2" disabled={editSubmitting}>
            {editSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Medical Records Dialog */}
      <Dialog open={recordsOpen} onOpenChange={setRecordsOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {viewingPet?.name}&apos;s Health Records
            </DialogTitle>
          </DialogHeader>
          {viewingPet && (
            <Tabs defaultValue="medical" className="space-y-4">
              <TabsList className="w-full">
                <TabsTrigger value="medical" className="flex-1 gap-1.5">
                  <Stethoscope className="h-4 w-4" />
                  Medical ({viewingPet.medicalHistory?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="vaccines" className="flex-1 gap-1.5">
                  <Syringe className="h-4 w-4" />
                  Vaccines ({viewingPet.vaccinations?.length || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="medical" className="space-y-3">
                {!viewingPet.medicalHistory?.length ? (
                  <p className="text-center text-sm text-muted-foreground py-6">
                    No medical history recorded yet
                  </p>
                ) : (
                  viewingPet.medicalHistory.map((record, i) => (
                    <div key={i} className="rounded-lg border border-border p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-foreground">{record.condition || "Visit"}</p>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(record.date)}
                        </span>
                      </div>
                      {record.treatment && (
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">Treatment: </span>
                          {record.treatment}
                        </p>
                      )}
                      {record.notes && (
                        <p className="text-sm text-muted-foreground italic">{record.notes}</p>
                      )}
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="vaccines" className="space-y-3">
                {!viewingPet.vaccinations?.length ? (
                  <p className="text-center text-sm text-muted-foreground py-6">
                    No vaccination records found
                  </p>
                ) : (
                  viewingPet.vaccinations.map((vac, i) => (
                    <div key={i} className="rounded-lg border border-border p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-foreground">{vac.name}</p>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(vac.date)}
                        </span>
                      </div>
                      {vac.nextDueDate && (
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">Next Due: </span>
                          {formatDate(vac.nextDueDate)}
                        </p>
                      )}
                      {vac.notes && (
                        <p className="text-sm text-muted-foreground italic">{vac.notes}</p>
                      )}
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Empty State */}
      {!loading && pets.length === 0 && (
        <div className="rounded-lg border border-border p-12 text-center">
          <Dog className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No pets yet</h3>
          <p className="text-muted-foreground">Add your first pet to get started</p>
        </div>
      )}

      {/* Pets Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pets.map((pet) => {
          const PetIcon = getPetIcon(pet.type)
          return (
            <Card key={pet._id} className="overflow-hidden">
              <CardHeader className="bg-primary/5 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <PetIcon className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{pet.name}</CardTitle>
                      <CardDescription>{pet.breed}</CardDescription>
                      {pet.color && (
                        <p className="text-xs text-muted-foreground mt-0.5">{pet.color}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleOpenEdit(pet)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDeletePet(pet._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Age</p>
                    <p className="font-medium text-foreground">
                      {pet.age?.years || 0}y {pet.age?.months || 0}m
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Weight</p>
                    <p className="font-medium text-foreground">
                      {pet.weight?.value || 0} {pet.weight?.unit || "kg"}
                    </p>
                  </div>
                  {pet.gender && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Gender</p>
                      <p className="font-medium text-foreground capitalize">{pet.gender}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs">
                    <Syringe className="h-3.5 w-3.5 text-primary" />
                    <span className="font-medium text-foreground">
                      {pet.vaccinations?.length || 0} vaccines
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs">
                    <Activity className="h-3.5 w-3.5 text-primary" />
                    <span className="font-medium text-foreground">
                      {pet.medicalHistory?.length || 0} records
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1 bg-transparent"
                    onClick={() => handleViewRecords(pet)}
                  >
                    <FileText className="h-4 w-4" />
                    Records
                  </Button>
                  <Button size="sm" className="flex-1 gap-1" asChild>
                    <Link href="/doctors">
                      <Calendar className="h-4 w-4" />
                      Book Visit
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}