"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { fetchStaff } from "@/lib/api/staff-api"
import type { WorkloadFilters } from "@/types/workload"
import type { Staff } from "@/types/staff"

interface WorkloadFilterProps {
  filters: WorkloadFilters
  setFilters: (filters: WorkloadFilters) => void
}

export function WorkloadFilter({ filters, setFilters }: WorkloadFilterProps) {
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const staffData = await fetchStaff()
        setStaff(staffData)
      } catch (error) {
        console.error("Failed to fetch staff:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStaff()
  }, [])

  const resetFilters = () => {
    setFilters({
      staffId: "",
      date: undefined,
      startDate: undefined,
      endDate: undefined,
    })
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <Label htmlFor="date-select">Specific Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date-select"
                variant={"outline"}
                className={cn("w-full justify-start text-left font-normal", !filters.date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.date ? format(filters.date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.date}
                onSelect={(date) => setFilters({ ...filters, date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

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
                initialFocus
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
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>
    </div>
  )
}
