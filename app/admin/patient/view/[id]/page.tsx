import { PatientDetail } from "@/components/patient/patient-detail"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { PatientDetailSkeleton } from "@/components/patient/patient-detail-skeleton"

type PageProps = {
  params: { id: string }
}

export default function PatientDetailPage({ params }: PageProps) {
  return (
    <div className="container py-10">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/admin/patient">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to patient list</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Patient Details</h1>
      </div>
      <Suspense fallback={<PatientDetailSkeleton />}>
        <PatientDetail id={params.id} />
      </Suspense>
    </div>
  )
} 