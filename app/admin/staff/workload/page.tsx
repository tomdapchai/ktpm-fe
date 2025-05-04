import { Suspense } from "react"
import { WorkloadDashboard } from "@/components/workload/workload-dashboard"
import { WorkloadTableSkeleton } from "@/components/workload/workload-table-skeleton"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function WorkloadPage() {
  return (
    <div className="container py-10">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/admin/staff">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to staff list</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Staff Workload Management</h1>
      </div>
      <Suspense fallback={<WorkloadTableSkeleton />}>
        <WorkloadDashboard />
      </Suspense>
    </div>
  )
}
