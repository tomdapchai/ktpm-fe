/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, use } from "react"
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
import { fetchStaff, deleteStaff } from "@/lib/api/staff-api"
import type { Staff, StaffFilters } from "@/types/staff"

interface StaffTableProps {
  filters: StaffFilters
}

export function StaffTable({ filters }: StaffTableProps) {
  const [staff, setStaff] = useState<Staff[]>([])
  const [allStaff, setAllStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [sortField, setSortField] = useState<string>("fullName")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const { toast } = useToast()
  const itemsPerPage = 10

  useEffect(() => {
    loadStaff()
  }, [filters, sortField, sortDirection])

  const loadStaff = async () => {
    setLoading(true)
    try {
      let data: Staff[] = []

      // Determine which API endpoint to call based on filters
      if (filters.staffType) {
        data = await fetchStaff(`/api/staff/type/${filters.staffType}`)
      } else if (filters.department) {
        data = await fetchStaff(`/api/staff/department/${filters.department}`)
      } else if (filters.specialization) {
        data = await fetchStaff(`/api/staff/specialization/${filters.specialization}`)
      } else if (filters.activeOnly) {
        data = await fetchStaff("/api/staff/active")
      } else {
        data = await fetchStaff("/api/staff")
      }

      // Client-side sorting
      data = sortStaff(data, sortField, sortDirection)

      // Client-side pagination
      setAllStaff(data)

      setTotalPages(Math.ceil(data.length / itemsPerPage))
      
      // Reset to first page when filters change
      setCurrentPage(1)
    } catch (error) {
      console.error("Failed to fetch staff:", error)
      toast({
        title: "Error",
        description: "Failed to load staff data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage()
  }, [currentPage, allStaff])

  const setPage = () => {
    setTotalPages(Math.ceil(allStaff.length / itemsPerPage))

    // Get current page items
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedData = allStaff.slice(startIndex, startIndex + itemsPerPage)

    setStaff(paginatedData)
  }

  const sortStaff = (data: Staff[], field: string, direction: "asc" | "desc") => {
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
      await deleteStaff(id)
      toast({
        title: "Success",
        description: "Staff member has been deleted successfully.",
      })
      loadStaff()
    } catch (error) {
      console.error("Failed to delete staff:", error)
      toast({
        title: "Error",
        description: "Failed to delete staff member. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading && staff.length === 0) {
    return <div className="flex justify-center p-8">Loading staff data...</div>
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("fullName")} className="flex items-center">
                  Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("staffType")} className="flex items-center">
                  Type
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("department")} className="flex items-center">
                  Department
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("position")} className="flex items-center">
                  Position
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No staff found.
                </TableCell>
              </TableRow>
            ) : (
              staff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.id}</TableCell>
                  <TableCell>{member.fullName}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        member.staffType === "DOCTOR"
                          ? "default"
                          : member.staffType === "NURSE"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {member.staffType}
                    </Badge>
                  </TableCell>
                  <TableCell>{member.department}</TableCell>
                  <TableCell>{member.position}</TableCell>
                  <TableCell>
                    <Badge variant={member.active ? "success" : "destructive"}>
                      {member.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/admin/staff/view/${member.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/admin/staff/view/${member.id}/edit`}>
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
                              This will permanently delete the staff member. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(member.id)}
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
