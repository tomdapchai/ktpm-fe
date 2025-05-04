"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Edit, Eye, Trash2, ArrowUpDown } from "lucide-react"
import Link from "next/link"
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
import { fetchWorkloads, deleteWorkload, getStaffById } from "@/lib/api/workload-api"
import { format } from "date-fns"
import type { Workload, WorkloadFilters } from "@/types/workload"
import type { Staff } from "@/types/staff"

interface WorkloadTableProps {
  filters: WorkloadFilters
}

export function WorkloadTable({ filters }: WorkloadTableProps) {
  const [workloads, setWorkloads] = useState<Workload[]>([])
  const [staffMap, setStaffMap] = useState<Record<number, Staff>>({})
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortField, setSortField] = useState<string>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const { toast } = useToast()
  const itemsPerPage = 10

  useEffect(() => {
    loadWorkloads()
  }, [filters, currentPage, sortField, sortDirection])

  const loadWorkloads = async () => {
    setLoading(true)
    try {
      let data: Workload[] = []
      let endpoint = "/api/staff/workloads"

      // Determine which API endpoint to call based on filters
      if (filters.staffId && filters.startDate && filters.endDate) {
        endpoint = `/api/staff/workloads/staff/${filters.staffId}/date-range?startDate=${format(
          filters.startDate,
          "yyyy-MM-dd",
        )}&endDate=${format(filters.endDate, "yyyy-MM-dd")}`
      } else if (filters.startDate && filters.endDate) {
        endpoint = `/api/staff/workloads/date-range?startDate=${format(
          filters.startDate,
          "yyyy-MM-dd",
        )}&endDate=${format(filters.endDate, "yyyy-MM-dd")}`
      } else if (filters.date) {
        endpoint = `/api/staff/workloads/date/${format(filters.date, "yyyy-MM-dd")}`
      } else if (filters.staffId) {
        endpoint = `/api/staff/workloads/staff/${filters.staffId}`
      }

      data = await fetchWorkloads(endpoint)

      // Client-side sorting
      data = sortWorkloads(data, sortField, sortDirection)

      // Client-side pagination
      setTotalPages(Math.ceil(data.length / itemsPerPage))

      // Get current page items
      const startIndex = (currentPage - 1) * itemsPerPage
      const paginatedData = data.slice(startIndex, startIndex + itemsPerPage)

      setWorkloads(paginatedData)

      // Fetch staff details for each workload
      const staffIds = new Set(data.map((workload) => workload.staffId))
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
      console.error("Failed to fetch workloads:", error)
      toast({
        title: "Error",
        description: "Failed to load workload data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const sortWorkloads = (data: Workload[], field: string, direction: "asc" | "desc") => {
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
      await deleteWorkload(id)
      toast({
        title: "Success",
        description: "Workload record has been deleted successfully.",
      })
      loadWorkloads()
    } catch (error) {
      console.error("Failed to delete workload:", error)
      toast({
        title: "Error",
        description: "Failed to delete workload record. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading && workloads.length === 0) {
    return <div className="flex justify-center p-8">Loading workload data...</div>
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
                <Button variant="ghost" onClick={() => handleSort("date")} className="flex items-center">
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("patientCount")} className="flex items-center">
                  Patients
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("hoursWorked")} className="flex items-center">
                  Hours
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workloads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No workload records found.
                </TableCell>
              </TableRow>
            ) : (
              workloads.map((workload) => (
                <TableRow key={workload.id}>
                  <TableCell className="font-medium">{workload.id}</TableCell>
                  <TableCell>{staffMap[workload.staffId]?.fullName || `Staff ID: ${workload.staffId}`}</TableCell>
                  <TableCell>{format(new Date(workload.date), "MMM dd, yyyy")}</TableCell>
                  <TableCell>{workload.patientCount}</TableCell>
                  <TableCell>{workload.hoursWorked.toFixed(1)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/admin/staff/workload/${workload.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/admin/staff/workload/${workload.id}/edit`}>
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
                              This will permanently delete the workload record. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(workload.id)}
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
