"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { fetchStaff } from "@/lib/api/staff-api"
import { fetchDepartments } from "@/lib/api/schedule-api"
import type { ScheduleFilters } from "@/types/schedule"
import type { Staff } from "@/types/staff"

interface ScheduleFilterProps {
  filters: ScheduleFilters
  setFilters: (filters: ScheduleFilters) => void
}

export function ScheduleFilter({ filters, setFilters }: ScheduleFilterProps) {
  const [staff, setStaff] = useState<Staff[]>([])
  const [departments, setDepartments] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [staffData, departmentData] = await Promise.all([fetchStaff(), fetchDepartments()])
        setStaff(staffData)
        setDepartments(departmentData)
      } catch (error) {
        console.error("Failed to fetch filter data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const resetFilters = () => {
    setFilters({
      staffId: "",
      shiftType: "",
      department: "",
      startDate: undefined,
      endDate: undefined,
      activeOnly: false,
    })
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="staff-select">Staff Member</Label>
          <Select
            value={filters.staffId.toString()}
            onValueChange={(value) => setFilters({ ...filters, staffId: value })}
          >
            <SelectTrigger id="staff-select">
              <SelectValue placeholder="All Staff" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Staff</SelectItem>
              {staff.map((member) => (
                <SelectItem key={member.id} value={member.id.toString()}>
                  {member.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="shift-type">Shift Type</Label>
          <Select value={filters.shiftType} onValueChange={(value) => setFilters({ ...filters, shiftType: value })}>
            <SelectTrigger id="shift-type">
              <SelectValue placeholder="All Shift Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Shift Types</SelectItem>
              <SelectItem value="MORNING">Morning</SelectItem>
              <SelectItem value="AFTERNOON">Afternoon</SelectItem>
              <SelectItem value="NIGHT">Night</SelectItem>
              <SelectItem value="ON_CALL">On Call</SelectItem>
              <SelectItem value="EMERGENCY">Emergency</SelectItem>
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
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start-date">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="start-date"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filters.startDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.startDate ? format(filters.startDate, "PPP") : <span>Start date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.startDate}
                onSelect={(date) => setFilters({ ...filters, startDate: date })}
                autoFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="end-date">End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="end-date"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filters.endDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.endDate ? format(filters.endDate, "PPP") : <span>End date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.endDate}
                onSelect={(date) => setFilters({ ...filters, endDate: date })}
                disabled={(date) => (filters.startDate ? date < filters.startDate : false)}
                autoFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id="active-only"
            checked={filters.activeOnly}
            onCheckedChange={(checked) => setFilters({ ...filters, activeOnly: checked })}
          />
          <Label htmlFor="active-only">Show active schedules only</Label>
        </div>

        <Button variant="outline" size="sm" onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>
    </div>
  )
}
