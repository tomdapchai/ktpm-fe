import { PatientForm } from "@/components/patient/patient-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function EditPatientPage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-10">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href={`/admin/patient/view/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to patient details</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Patient</h1>
      </div>
      <PatientForm id={params.id} />
    </div>
  )
} 