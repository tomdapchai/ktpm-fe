import { ScheduleDetail } from "@/components/schedule/schedule-detail"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { ScheduleDetailSkeleton } from "@/components/schedule/schedule-detail-skeleton"

type PageProps = {
  params: { id: string }
}

export default function ScheduleDetailPage({ params }: PageProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/admin/staff/schedule">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to schedule list</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Schedule Details</h1>
      </div>
      <Suspense fallback={<ScheduleDetailSkeleton />}>
        <ScheduleDetail id={params.id} />
      </Suspense>
    </div>
  )
}
