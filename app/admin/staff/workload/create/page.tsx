import { WorkloadForm } from "@/components/workload/workload-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreateWorkloadPage() {
  return (
    <div className="container py-10">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/admin/staff/workload">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to workload list</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Record New Workload</h1>
      </div>
      <WorkloadForm />
    </div>
  )
}
