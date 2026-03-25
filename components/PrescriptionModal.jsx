"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Loader2, Trash2, Plus } from "lucide-react"
import { api } from "@/lib/api"

export default function PrescriptionModal({ 
  isOpen, 
  onClose, 
  appointmentId, 
  petName,
  ownerName,
  onSuccess 
}) {
  const [medications, setMedications] = useState([
    { name: "", dosage: "", frequency: "", duration: "", instructions: "" }
  ])
  const [tests, setTests] = useState([""])
  const [followUpDate, setFollowUpDate] = useState("")
  const [diagnosis, setDiagnosis] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const addMedicationRow = () => {
    setMedications([
      ...medications,
      { name: "", dosage: "", frequency: "", duration: "", instructions: "" }
    ])
  }

  const removeMedicationRow = (index) => {
    setMedications(medications.filter((_, i) => i !== index))
  }

  const updateMedication = (index, field, value) => {
    const updated = [...medications]
    updated[index][field] = value
    setMedications(updated)
  }

  const addTestRow = () => {
    setTests([...tests, ""])
  }

  const removeTestRow = (index) => {
    setTests(tests.filter((_, i) => i !== index))
  }

  const updateTest = (index, value) => {
    const updated = [...tests]
    updated[index] = value
    setTests(updated)
  }

  const handleSubmit = async () => {
    // Validate at least one medication
    const validMedications = medications.filter(m => m.name.trim())
    if (validMedications.length === 0) {
      setError("Please add at least one medication")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const validTests = tests.filter(t => t.trim())

      await api.updateAppointment(appointmentId, {
        prescription: {
          medications: validMedications,
          tests: validTests,
          followUpDate: followUpDate || undefined
        },
        notes: {
          diagnosis: diagnosis
        }
      })

      onSuccess?.()
      handleClose()
    } catch (err) {
      setError(err.message || "Failed to save prescription")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    // Reset form
    setMedications([{ name: "", dosage: "", frequency: "", duration: "", instructions: "" }])
    setTests([""])
    setFollowUpDate("")
    setDiagnosis("")
    setError(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Prescription</DialogTitle>
          <DialogDescription>
            Add medicines and tests for {petName} (Owner: {ownerName})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Diagnosis */}
          <div className="space-y-2">
            <Label htmlFor="diagnosis">Diagnosis</Label>
            <Textarea
              id="diagnosis"
              placeholder="Describe the diagnosis and condition..."
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              rows={2}
            />
          </div>

          {/* Medications */}
          <div className="space-y-3">
            <Label>Medications</Label>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {medications.map((med, index) => (
                <div key={index} className="space-y-2 p-3 border border-border rounded-lg bg-muted/30">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Medicine Name *</Label>
                      <Input
                        placeholder="e.g., Amoxicillin"
                        value={med.name}
                        onChange={(e) => updateMedication(index, "name", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Dosage</Label>
                      <Input
                        placeholder="e.g., 500mg"
                        value={med.dosage}
                        onChange={(e) => updateMedication(index, "dosage", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Frequency *</Label>
                      <Input
                        placeholder="e.g., Twice daily"
                        value={med.frequency}
                        onChange={(e) => updateMedication(index, "frequency", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Duration *</Label>
                      <Input
                        placeholder="e.g., 7 days"
                        value={med.duration}
                        onChange={(e) => updateMedication(index, "duration", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">Instructions</Label>
                    <Textarea
                      placeholder="e.g., Take with food, after meals..."
                      value={med.instructions}
                      onChange={(e) => updateMedication(index, "instructions", e.target.value)}
                      rows={2}
                    />
                  </div>

                  {medications.length > 1 && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeMedicationRow(index)}
                      className="w-full gap-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      Remove Medicine
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={addMedicationRow}
              className="w-full gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Another Medicine
            </Button>
          </div>

          {/* Tests */}
          <div className="space-y-3">
            <Label>Recommended Tests (Optional)</Label>
            <div className="space-y-2">
              {tests.map((test, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="e.g., Blood test, X-ray..."
                    value={test}
                    onChange={(e) => updateTest(index, e.target.value)}
                  />
                  {tests.length > 1 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeTestRow(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={addTestRow}
              className="w-full gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Test
            </Button>
          </div>

          {/* Follow-up Date */}
          <div className="space-y-2">
            <Label htmlFor="followup">Follow-up Date (Optional)</Label>
            <Input
              id="followup"
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Prescription"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
