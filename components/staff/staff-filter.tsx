"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { StaffFilters } from "@/types/staff"

interface StaffFilterProps {
  filters: StaffFilters
  setFilters: (filters: StaffFilters) => void
}

export function StaffFilter({ filters, setFilters }: StaffFilterProps) {
  const [departments, setDepartments] = useState<string[]>([])
  const [specializations, setSpecializations] = useState<string[]>([])

  useEffect(() => {
    // In a real app, you would fetch these from the API
    // For now, we'll use mock data
    setDepartments([
      "Cardiology",
      "Neurology",
      "Pediatrics",
      "Oncology",
      "Emergency",
      "Radiology",
      "Surgery",
      "Orthopedics",
      "Psychiatry",
      "Dermatology",
    ])

    setSpecializations([
      "Cardiac Surgery",
      "Neurosurgery",
      "Pediatric Cardiology",
      "Medical Oncology",
      "Emergency Medicine",
      "Diagnostic Radiology",
      "General Surgery",
      "Orthopedic Surgery",
      "Child Psychiatry",
      "Dermatopathology",
    ])
  }, [])

  const resetFilters = () => {
    setFilters({
      staffType: "",
      department: "",
      specialization: "",
      activeOnly: false,
      searchTerm: "",
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="staff-type">Staff Type</Label>
          <Select value={filters.staffType} onValueChange={(value) => setFilters({ ...filters, staffType: value })}>
            <SelectTrigger id="staff-type">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="DOCTOR">Doctor</SelectItem>
              <SelectItem value="NURSE">Nurse</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Select value={filters.department} onValueChange={(value) => setFilters({ ...filters, department: value })}>
            <SelectTrigger id="department">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="specialization">Specialization</Label>
          <Select
            value={filters.specialization}
            onValueChange={(value) => setFilters({ ...filters, specialization: value })}
          >
            <SelectTrigger id="specialization">
              <SelectValue placeholder="All Specializations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Specializations</SelectItem>
              {specializations.map((spec) => (
                <SelectItem key={spec} value={spec}>
                  {spec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Input
              id="search"
              placeholder="Search by name, email..."
              value={filters.searchTerm}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
            />
            {filters.searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setFilters({ ...filters, searchTerm: "" })}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id="active-only"
            checked={filters.activeOnly}
            onCheckedChange={(checked) => setFilters({ ...filters, activeOnly: checked })}
          />
          <Label htmlFor="active-only">Show active staff only</Label>
        </div>

        <Button variant="outline" size="sm" onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>
    </div>
  )
}
