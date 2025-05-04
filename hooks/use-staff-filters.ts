"use client"

import { useState, useCallback } from "react"
import type { StaffFilters } from "@/types/staff"

export function useStaffFilters() {
  const [filters, setFilters] = useState<StaffFilters>({
    staffType: "",
    department: "",
    specialization: "",
    activeOnly: false,
    searchTerm: "",
  })

  const updateFilters = useCallback((newFilters: StaffFilters) => {
    setFilters(newFilters)
  }, [])

  return {
    filters,
    setFilters: updateFilters,
  }
}
