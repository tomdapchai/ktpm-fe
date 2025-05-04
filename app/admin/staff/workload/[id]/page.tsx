import { WorkloadDetail } from "@/components/workload/workload-detail"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { WorkloadDetailSkeleton } from "@/components/workload/workload-detail-skeleton"

export default function WorkloadDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/admin/staff/workload">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to workload list</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Workload Details</h1>
      </div>
      <Suspense fallback={<WorkloadDetailSkeleton />}>
        <WorkloadDetail id={params.id} />
      </Suspense>
    </div>
  )
}
