import { WorkloadForm } from "@/components/workload/workload-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

type PageProps = {
  params: { id: string }
}

export default function EditWorkloadPage({ params }: PageProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href={`/admin/staff/workload/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to workload details</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Workload</h1>
      </div>
      <WorkloadForm id={params.id} />
    </div>
  )
}
