import { ScheduleForm } from "@/components/schedule/schedule-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreateSchedulePage() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/admin/staff/schedule">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to schedule list</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Create New Schedule</h1>
      </div>
      <ScheduleForm />
    </div>
  )
}
