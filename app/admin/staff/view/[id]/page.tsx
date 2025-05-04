import { StaffDetail } from "@/components/staff/staff-detail"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { StaffDetailSkeleton } from "@/components/staff/staff-detail-skeleton"

export default function StaffDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-10">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/admin/staff">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to staff list</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Staff Details</h1>
      </div>
      <Suspense fallback={<StaffDetailSkeleton />}>
        <StaffDetail id={params.id} />
      </Suspense>
    </div>
  )
}
