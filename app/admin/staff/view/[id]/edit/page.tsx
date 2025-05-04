import { StaffForm } from "@/components/staff/staff-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditStaffPage({ params }: { params: { id: string } }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href={`/admin/staff/view/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to staff details</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Staff</h1>
      </div>
      <StaffForm id={params.id} />
    </div>
  )
}
