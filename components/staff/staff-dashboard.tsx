"use client"
import { StaffTable } from "./staff-table"
import { StaffFilter } from "./staff-filter"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useStaffFilters } from "@/hooks/use-staff-filters"

export function StaffDashboard() {
  const { filters, setFilters } = useStaffFilters()

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <StaffFilter filters={filters} setFilters={setFilters} />
        <Button asChild className="w-full sm:w-auto">
          <Link href="/staff/create">
            <Plus className="mr-2 h-4 w-4" />
            Add New Staff
          </Link>
        </Button>
      </div>
      <StaffTable filters={filters} />
    </div>
  )
}
