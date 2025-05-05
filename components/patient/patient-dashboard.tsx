"use client"
import { PatientTable } from "./patient-table"
import { PatientFilter } from "./patient-filter"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { usePatientFilters } from "@/hooks/use-patient-filters"

export function PatientDashboard() {
  const { filters, setFilters } = usePatientFilters()

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
        <PatientFilter filters={filters} setFilters={setFilters} />
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/patient/create">
            <Plus className="mr-2 h-4 w-4" />
            Add New Patient
          </Link>
        </Button>
      </div>
      <PatientTable filters={filters} />
    </div>
  )
} 