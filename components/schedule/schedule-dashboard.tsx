"use client"
import { ScheduleTable } from "./schedule-table"
import { ScheduleFilter } from "./schedule-filter"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import type { ScheduleFilters } from "@/types/schedule"

export function ScheduleDashboard() {
  const [filters, setFilters] = useState<ScheduleFilters>({
    staffId: "",
    shiftType: "",
    department: "",
    startDate: undefined,
    endDate: undefined,
    activeOnly: false,
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <ScheduleFilter filters={filters} setFilters={setFilters} />
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/staff/schedule/create">
            <Plus className="mr-2 h-4 w-4" />
            Create New Schedule
          </Link>
        </Button>
      </div>
      <ScheduleTable filters={filters} />
    </div>
  )
}
