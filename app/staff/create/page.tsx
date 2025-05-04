import { StaffForm } from "@/components/staff/staff-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreateStaffPage() {
  return (
    <div className="container">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/staff">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to staff list</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Add New Staff</h1>
      </div>
      <StaffForm />
    </div>
  )
}
