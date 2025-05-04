import { Suspense } from "react"
import { ScheduleDashboard } from "@/components/schedule/schedule-dashboard"
import { ScheduleTableSkeleton } from "@/components/schedule/schedule-table-skeleton"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SchedulePage() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/admin/staff">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to staff list</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Staff Schedule Management</h1>
      </div>
      <Suspense fallback={<ScheduleTableSkeleton />}>
        <ScheduleDashboard />
      </Suspense>
    </div>
  )
}
