"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { PatientFilters } from "@/types/patient"

interface PatientFilterProps {
  filters: PatientFilters & { searchTerm?: string }
  setFilters: (filters: PatientFilters & { searchTerm?: string }) => void
}

export function PatientFilter({ filters, setFilters }: PatientFilterProps) {
  const [bloodTypes, setBloodTypes] = useState<string[]>([])

  useEffect(() => {
    // In a real app, you would fetch these from the API
    // For now, we'll use mock data
    setBloodTypes([
      "A+",
      "A-",
      "B+",
      "B-",
      "AB+",
      "AB-",
      "O+",
      "O-",
    ])
  }, [])

  const resetFilters = () => {
    setFilters({
      bloodType: "all",
      gender: "all",
      activeOnly: false,
      searchTerm: "",
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="blood-type">Blood Type</Label>
          <Select value={filters.bloodType} onValueChange={(value) => setFilters({ ...filters, bloodType: value })}>
            <SelectTrigger id="blood-type">
              <SelectValue placeholder="All Blood Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Blood Types</SelectItem>
              {bloodTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select value={filters.gender} onValueChange={(value) => setFilters({ ...filters, gender: value })}>
            <SelectTrigger id="gender">
              <SelectValue placeholder="All Genders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="MALE">Male</SelectItem>
              <SelectItem value="FEMALE">Female</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
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

      <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Switch
            id="active-only"
            checked={filters.activeOnly}
            onCheckedChange={(checked) => setFilters({ ...filters, activeOnly: checked })}
          />
          <Label htmlFor="active-only">Show active patients only</Label>
        </div>

        <Button variant="outline" size="sm" onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>
    </div>
  )
} 