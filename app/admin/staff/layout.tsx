import type React from "react"
import { StaffNavigation } from "@/components/staff/staff-navigation"

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <StaffNavigation />
      <main className="flex-1">{children}</main>
    </div>
  )
}
