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
import { Dog, Cat, Plus, Calendar, Syringe, FileText, Edit, Trash2, Loader2 } from "lucide-react"
import { api } from "@/lib/api"

export default function PetsPage() {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [newPet, setNewPet] = useState({
    name: "",
    type: "dog",
    breed: "",
    age: { years: 0, months: 0 },
    weight: { value: 0, unit: "kg" },
  })

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
      setSubmitting(true)
      await api.createPet(newPet)
      await fetchPets()
      setNewPet({ name: "", type: "dog", breed: "", age: { years: 0, months: 0 }, weight: { value: 0, unit: "kg" } })
      setDialogOpen(false)
    } catch (error) {
      console.error("Failed to create pet:", error)
    } finally {
      setSubmitting(false)
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

  const getPetIcon = (type) => {
    switch (type) {
      case "dog":
        return Dog
      case "cat":
        return Cat
      default:
        return Dog
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Pets</h1>
          <p className="text-muted-foreground">Manage your pet profiles and health records</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Pet
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Pet</DialogTitle>
              <DialogDescription>
                Enter your pet's details to create a new profile
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="pet-name">Pet Name</Label>
                <Input
                  id="pet-name"
                  placeholder="Enter pet name"
                  value={newPet.name}
                  onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pet-type">Pet Type</Label>
                <Select
                  value={newPet.type}
                  onValueChange={(value) => setNewPet({ ...newPet, type: value })}
                >
                  <SelectTrigger id="pet-type">
                    <SelectValue placeholder="Select type" />
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
                <Label htmlFor="pet-breed">Breed</Label>
                <Input
                  id="pet-breed"
                  placeholder="Enter breed"
                  value={newPet.breed}
                  onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pet-age">Age (Years)</Label>
                  <Input
                    id="pet-age"
                    type="number"
                    placeholder="Years"
                    value={newPet.age.years}
                    onChange={(e) => setNewPet({ ...newPet, age: { ...newPet.age, years: parseInt(e.target.value) || 0 } })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pet-weight">Weight (kg)</Label>
                  <Input
                    id="pet-weight"
                    type="number"
                    placeholder="Weight"
                    value={newPet.weight.value}
                    onChange={(e) => setNewPet({ ...newPet, weight: { ...newPet.weight, value: parseFloat(e.target.value) || 0 } })}
                  />
                </div>
              </div>
              <Button onClick={handleAddPet} className="w-full" disabled={submitting}>
                {submitting ? "Adding..." : "Add Pet"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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
                    </div>
                  </div>
                  <div className="flex gap-1">
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
                    <p className="font-medium text-foreground">{pet.age?.years || 0} years {pet.age?.months || 0} months</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Weight</p>
                    <p className="font-medium text-foreground">{pet.weight?.value || 0} {pet.weight?.unit || "kg"}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs">
                    <Syringe className="h-3.5 w-3.5 text-primary" />
                    <span className="font-medium text-foreground">{pet.vaccinations?.length || 0} vaccines</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-1 bg-transparent">
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
