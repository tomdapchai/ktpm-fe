"use client"

import { useState, useCallback } from "react"
import type { PatientFilters } from "@/types/patient"

export function usePatientFilters() {
  const [filters, setFilters] = useState<PatientFilters & { searchTerm?: string }>({
    bloodType: "all",
    gender: "all",
    activeOnly: false,
    searchTerm: "",
  })

  const updateFilters = useCallback((newFilters: PatientFilters & { searchTerm?: string }) => {
    setFilters(newFilters)
  }, [])

  return {
    filters,
    setFilters: updateFilters,
  }
} 