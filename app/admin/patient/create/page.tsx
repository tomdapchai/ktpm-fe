import { PatientForm } from "@/components/patient/patient-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreatePatientPage() {
  return (
    <div className="container">
      <div className="flex items-center justify-end mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/admin/patient">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to patient list</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Add New Patient</h1>
      </div>
      <PatientForm />
    </div>
  )
} 