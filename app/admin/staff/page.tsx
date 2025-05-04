"use client"
import { Suspense } from "react"
import { StaffDashboard } from "@/components/staff/staff-dashboard"
import { StaffTableSkeleton } from "@/components/staff/staff-table-skeleton"

export default function StaffPage() {
  
  return (
    <div className=" w-full h-full flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Staff Management</h1>
      <Suspense fallback={<StaffTableSkeleton />}>
        <StaffDashboard />
      </Suspense>
    </div>
  )
}
