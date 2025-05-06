import { ScheduleForm } from "@/components/schedule/schedule-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

type PageProps = {
  params: { id: string }
}

export default function EditSchedulePage({ params }: PageProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href={`/admin/staff/schedule/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to schedule details</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Schedule</h1>
      </div>
      <ScheduleForm id={params.id} />
    </div>
  )
}
