"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, AlertCircle } from "lucide-react"
import jsPDF from "jspdf"

export default function PrescriptionView({ prescription, appointment }) {
  if (!prescription || !prescription.medications || prescription.medications.length === 0) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium text-amber-900">No prescription yet</p>
          <p className="text-sm text-amber-800">The doctor hasn't added a prescription for this appointment.</p>
        </div>
      </div>
    )
  }

  const downloadPrescriptionPDF = () => {
    try {
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      let yPosition = 15

      // Header
      doc.setFont("helvetica", "bold")
      doc.setFontSize(20)
      doc.text("VETLIC-AT-HOME", pageWidth / 2, yPosition, { align: "center" })
      yPosition += 7

      doc.setFont("helvetica", "normal")
      doc.setFontSize(10)
      doc.text("Professional Veterinary Prescription", pageWidth / 2, yPosition, { align: "center" })
      yPosition += 10

      // Prescription Details
      doc.setFont("helvetica", "bold")
      doc.setFontSize(12)
      doc.text("Prescription Details:", 15, yPosition)
      yPosition += 7

      doc.setFont("helvetica", "normal")
      doc.setFontSize(10)

      if (appointment) {
        doc.text(`Pet: ${appointment.pet?.name || "N/A"}`, 15, yPosition)
        yPosition += 5
        doc.text(`Breed: ${appointment.pet?.breed || "N/A"}`, 15, yPosition)
        yPosition += 5
        doc.text(
          `Date: ${new Date(appointment.appointmentDate).toLocaleDateString()}`,
          15,
          yPosition
        )
        yPosition += 5
        doc.text(`Doctor: ${appointment.doctor?.user?.name || "N/A"}`, 15, yPosition)
        yPosition += 8
      }

      // Diagnosis
      if (appointment?.notes?.diagnosis) {
        doc.setFont("helvetica", "bold")
        doc.text("Diagnosis:", 15, yPosition)
        yPosition += 5
        doc.setFont("helvetica", "normal")
        const diagnosisLines = doc.splitTextToSize(
          appointment.notes.diagnosis,
          pageWidth - 30
        )
        doc.text(diagnosisLines, 15, yPosition)
        yPosition += diagnosisLines.length * 5 + 3
      }

      // Medications
      doc.setFont("helvetica", "bold")
      doc.setFontSize(12)
      doc.text("Medications:", 15, yPosition)
      yPosition += 6

      doc.setFont("helvetica", "normal")
      doc.setFontSize(10)

      prescription.medications.forEach((med, index) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 40) {
          doc.addPage()
          yPosition = 15
        }

        // Medicine number
        doc.setFont("helvetica", "bold")
        doc.text(`${index + 1}. ${med.name}`, 15, yPosition)
        yPosition += 5

        // Medicine details
        doc.setFont("helvetica", "normal")
        const details = []
        if (med.dosage) details.push(`Dosage: ${med.dosage}`)
        if (med.frequency) details.push(`Frequency: ${med.frequency}`)
        if (med.duration) details.push(`Duration: ${med.duration}`)

        doc.text(details.join(" | "), 20, yPosition)
        yPosition += 5

        if (med.instructions) {
          const instructionLines = doc.splitTextToSize(
            `Instructions: ${med.instructions}`,
            pageWidth - 30
          )
          doc.text(instructionLines, 20, yPosition)
          yPosition += instructionLines.length * 4 + 2
        }

        yPosition += 2
      })

      // Tests
      if (prescription.tests && prescription.tests.length > 0) {
        yPosition += 3
        doc.setFont("helvetica", "bold")
        doc.setFontSize(12)
        doc.text("Recommended Tests:", 15, yPosition)
        yPosition += 6

        doc.setFont("helvetica", "normal")
        doc.setFontSize(10)
        prescription.tests.forEach((test) => {
          if (test.trim()) {
            doc.text(`• ${test}`, 20, yPosition)
            yPosition += 5
          }
        })
      }

      // Follow-up
      if (prescription.followUpDate) {
        yPosition += 3
        doc.setFont("helvetica", "bold")
        doc.setFontSize(12)
        doc.text("Follow-up Date:", 15, yPosition)
        yPosition += 5
        doc.setFont("helvetica", "normal")
        doc.setFontSize(10)
        doc.text(
          new Date(prescription.followUpDate).toLocaleDateString(),
          20,
          yPosition
        )
      }

      // Footer
      yPosition = pageHeight - 20
      doc.setFont("helvetica", "italic")
      doc.setFontSize(8)
      doc.text(
        "This is a digitally generated prescription. Please keep it safe and follow the instructions carefully.",
        pageWidth / 2,
        yPosition,
        { align: "center" }
      )

      // Download
      const fileName = `Prescription_${appointment?.pet?.name || "Pet"}_${new Date().toISOString().split('T')[0]}.pdf`
      doc.save(fileName)
    } catch (error) {
      console.error("Failed to generate PDF:", error)
      alert("Failed to download prescription. Please try again.")
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Prescription</CardTitle>
            <CardDescription>
              Prescribed on{" "}
              {appointment?.appointmentDate
                ? new Date(appointment.appointmentDate).toLocaleDateString()
                : "N/A"}
            </CardDescription>
          </div>
          <Button onClick={downloadPrescriptionPDF} className="gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Diagnosis */}
          {appointment?.notes?.diagnosis && (
            <div>
              <h3 className="font-semibold text-foreground mb-2">Diagnosis</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {appointment.notes.diagnosis}
              </p>
            </div>
          )}

          {/* Medications */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Medications</h3>
            <div className="space-y-3">
              {prescription.medications.map((med, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-border bg-muted/30 p-3"
                >
                  <p className="font-medium text-foreground">{med.name}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    {med.dosage && <p>💊 Dosage: {med.dosage}</p>}
                    {med.frequency && <p>⏰ Frequency: {med.frequency}</p>}
                    {med.duration && <p>📅 Duration: {med.duration}</p>}
                  </div>
                  {med.instructions && (
                    <p className="mt-2 text-sm italic text-muted-foreground">
                      📝 {med.instructions}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tests */}
          {prescription.tests && prescription.tests.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground mb-2">Recommended Tests</h3>
              <ul className="space-y-1">
                {prescription.tests.map(
                  (test, index) =>
                    test.trim() && (
                      <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {test}
                      </li>
                    )
                )}
              </ul>
            </div>
          )}

          {/* Follow-up */}
          {prescription.followUpDate && (
            <div className="rounded-lg bg-primary/10 p-3">
              <p className="text-sm font-medium text-primary">
                📍 Follow-up scheduled for{" "}
                {new Date(prescription.followUpDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
