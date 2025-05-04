"use client"
import { Suspense } from "react"
import { StaffDashboard } from "@/components/staff/staff-dashboard"
import { StaffTableSkeleton } from "@/components/staff/staff-table-skeleton"
import { Button } from "@mui/material"
import { logout } from "@/lib/cookies"
import { useRouter } from "next/navigation";

export default function StaffPage() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await logout()
      router.push("/auth") // Redirect to login page
    } catch (error) {
      console.error("Logout error:", error)
    }
  }
  return (
    <div className=" w-full h-full flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Staff Management</h1>
      <Button onClick={handleLogout}>Logout</Button>
      <Suspense fallback={<StaffTableSkeleton />}>
        <StaffDashboard />
      </Suspense>
    </div>
  )
}
