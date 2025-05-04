"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Edit, Eye, Trash2, ArrowUpDown } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { fetchSchedules, deleteSchedule, getStaffById } from "@/lib/api/schedule-api"
import { format } from "date-fns"
import type { Schedule, ScheduleFilters } from "@/types/schedule"
import type { Staff } from "@/types/staff"

interface ScheduleTableProps {
  filters: ScheduleFilters
}

export function ScheduleTable({ filters }: ScheduleTableProps) {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [staffMap, setStaffMap] = useState<Record<number, Staff>>({})
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortField, setSortField] = useState<string>("startTime")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const { toast } = useToast()
  const itemsPerPage = 10

  useEffect(() => {
    loadSchedules()
  }, [filters, currentPage, sortField, sortDirection])

  const loadSchedules = async () => {
    setLoading(true)
    try {
      let data: Schedule[] = []
      let endpoint = "/api/staff/schedules"

      // Determine which API endpoint to call based on filters
      if (filters.staffId && filters.startDate && filters.endDate) {
        endpoint = `/api/staff/schedules/staff/${filters.staffId}/date-range?startTime=${filters.startDate.toISOString()}&endTime=${filters.endDate.toISOString()}`
      } else if (filters.startDate && filters.endDate) {
        endpoint = `/api/staff/schedules/date-range?startTime=${filters.startDate.toISOString()}&endTime=${filters.endDate.toISOString()}`
      } else if (filters.staffId) {
        endpoint = `/api/staff/schedules/staff/${filters.staffId}`
      } else if (filters.shiftType) {
        if (filters.shiftType == 'all') {
            endpoint = "/api/staff/schedules"
        }
        else 
            endpoint = `/api/staff/schedules/shift-type/${filters.shiftType}`
      } else if (filters.department) {
        endpoint = `/api/staff/schedules/department/${filters.department}`
      } else if (filters.activeOnly) {
        endpoint = "/api/staff/schedules/active"
      }

      data = await fetchSchedules(endpoint)

      // Client-side sorting
      data = sortSchedules(data, sortField, sortDirection)

      // Client-side pagination
      setTotalPages(Math.ceil(data.length / itemsPerPage))

      // Get current page items
      const startIndex = (currentPage - 1) * itemsPerPage
      const paginatedData = data.slice(startIndex, startIndex + itemsPerPage)

      setSchedules(paginatedData)

      // Fetch staff details for each schedule
      const staffIds = new Set(data.map((schedule) => schedule.staffId))
      const staffDetails: Record<number, Staff> = {}

      for (const staffId of staffIds) {
        try {
          const staff = await getStaffById(staffId)
          staffDetails[staffId] = staff
        } catch (error) {
          console.error(`Failed to fetch staff with ID ${staffId}:`, error)
        }
      }

      setStaffMap(staffDetails)
    } catch (error) {
      console.error("Failed to fetch schedules:", error)
      toast({
        title: "Error",
        description: "Failed to load schedule data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const sortSchedules = (data: Schedule[], field: string, direction: "asc" | "desc") => {
    return [...data].sort((a, b) => {
      const aValue = field.split(".").reduce((obj, key) => obj?.[key], a as any) || ""
      const bValue = field.split(".").reduce((obj, key) => obj?.[key], b as any) || ""

      if (direction === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteSchedule(id)
      toast({
        title: "Success",
        description: "Schedule has been deleted successfully.",
      })
      loadSchedules()
    } catch (error) {
      console.error("Failed to delete schedule:", error)
      toast({
        title: "Error",
        description: "Failed to delete schedule. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getShiftTypeBadgeVariant = (shiftType: string) => {
    switch (shiftType) {
      case "MORNING":
        return "default"
      case "AFTERNOON":
        return "secondary"
      case "NIGHT":
        return "outline"
      case "ON_CALL":
        return "destructive"
      case "EMERGENCY":
        return "destructive"
      default:
        return "outline"
    }
  }

  if (loading && schedules.length === 0) {
    return <div className="flex justify-center p-8">Loading schedule data...</div>
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("staffId")} className="flex items-center">
                  Staff
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("startTime")} className="flex items-center">
                  Start Time
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("endTime")} className="flex items-center">
                  End Time
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("shiftType")} className="flex items-center">
                  Shift Type
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("department")} className="flex items-center">
                  Department
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No schedules found.
                </TableCell>
              </TableRow>
            ) : (
              schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell className="font-medium">{schedule.id}</TableCell>
                  <TableCell>{staffMap[schedule.staffId]?.fullName || `Staff ID: ${schedule.staffId}`}</TableCell>
                  <TableCell>{format(new Date(schedule.startTime).toLocaleString(), "MMM dd, yyyy HH:mm")}</TableCell>
                  <TableCell>{format(new Date(schedule.endTime).toLocaleString(), "MMM dd, yyyy HH:mm")}</TableCell>
                  <TableCell>
                    <Badge variant={getShiftTypeBadgeVariant(schedule.shiftType)}>{schedule.shiftType}</Badge>
                  </TableCell>
                  <TableCell>{schedule.department}</TableCell>
                  <TableCell>
                    <Badge variant={schedule.active ? "success" : "destructive"}>
                      {schedule.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/admin/staff/schedule/${schedule.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/admin/staff/schedule/${schedule.id}/edit`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the schedule. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(schedule.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous Page</span>
        </Button>
        <div className="text-sm">
          Page {currentPage} of {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next Page</span>
        </Button>
      </div>
    </div>
  )
}
