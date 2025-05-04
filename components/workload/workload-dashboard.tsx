"use client"
import { WorkloadTable } from "./workload-table"
import { WorkloadFilter } from "./workload-filter"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import type { WorkloadFilters } from "@/types/workload"

export function WorkloadDashboard() {
  const [filters, setFilters] = useState<WorkloadFilters>({
    staffId: "",
    date: undefined,
    startDate: undefined,
    endDate: undefined,
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-end">
        <WorkloadFilter filters={filters} setFilters={setFilters} />
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/staff/workload/create">
            <Plus className="mr-2 h-4 w-4" />
            Record New Workload
          </Link>
        </Button>
      </div>
      <WorkloadTable filters={filters} />
    </div>
  )
}
