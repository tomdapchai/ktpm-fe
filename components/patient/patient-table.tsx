/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { fetchPatients } from "@/lib/api/patient-api"
import type { Patient, PatientFilters } from "@/types/patient"

interface PatientTableProps {
  filters: PatientFilters & { searchTerm?: string }
}

export function PatientTable({ filters }: PatientTableProps) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [allPatients, setAllPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortField, setSortField] = useState<string>("fullName")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const { toast } = useToast()
  const itemsPerPage = 10

  useEffect(() => {
    loadPatients()
  }, [filters, sortField, sortDirection])

  const loadPatients = async () => {
    setLoading(true)
    try {
      let data: Patient[] = []

      // Chỉ gọi API dựa vào activeOnly
      if (filters.activeOnly) {
        data = await fetchPatients("/api/patient/active")
      } else {
        data = await fetchPatients("/api/patient")
      }

      // Lọc theo bloodType client-side
      if (filters.bloodType && filters.bloodType !== "all") {
        data = data.filter(patient => patient.bloodType === filters.bloodType)
      }
      
      // Lọc theo gender client-side
      if (filters.gender && filters.gender !== "all") {
        data = data.filter(patient => patient.gender === filters.gender)
      }

      // Apply search filter client-side if search term exists
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase()
        data = data.filter(
          (patient) =>
            patient.fullName.toLowerCase().includes(searchTerm) ||
            patient.email.toLowerCase().includes(searchTerm) ||
            patient.phoneNumber.includes(searchTerm)
        )
      }

      // Client-side sorting
      data = sortPatients(data, sortField, sortDirection)

      // Set all patients for pagination
      setAllPatients(data)

      // Calculate total pages
      setTotalPages(Math.ceil(data.length / itemsPerPage))
      
      // Reset to first page when filters change
      setCurrentPage(1)
    } catch (error) {
      console.error("Failed to fetch patients:", error)
      toast({
        title: "Error",
        description: "Failed to load patient data. Please try again.",
        variant: "destructive",
      })
      // Initialize with empty array on error
      setAllPatients([])
      setTotalPages(1)
      setCurrentPage(1)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage()
  }, [currentPage, allPatients])

  const setPage = () => {
    setTotalPages(Math.ceil(allPatients.length / itemsPerPage))

    // Get current page items
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedData = allPatients.slice(startIndex, startIndex + itemsPerPage)

    setPatients(paginatedData)
  }

  const sortPatients = (data: Patient[], field: string, direction: "asc" | "desc") => {
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

  if (loading && patients.length === 0) {
    return <div className="flex justify-center p-8">Loading patient data...</div>
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
                <Button variant="ghost" onClick={() => handleSort("bloodType")} className="flex items-center">
                  Blood Type
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("gender")} className="flex items-center">
                  Gender
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("registrationDate")} className="flex items-center">
                  Registration Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No patients found.
                </TableCell>
              </TableRow>
            ) : (
              patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.id}</TableCell>
                  <TableCell>{patient.fullName}</TableCell>
                  <TableCell>{patient.bloodType}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>{new Date(patient.registrationDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {patient.active ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/patient/view/${patient.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View patient details</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/patient/view/${patient.id}/edit`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit patient</span>
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete patient</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to delete this patient?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the patient record and all
                              associated data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={async () => {
                                try {
                                  // API call would be here
                                  toast({
                                    title: "Success",
                                    description: "Patient has been deleted successfully.",
                                  })
                                  loadPatients()
                                } catch (error) {
                                  console.error("Failed to delete patient:", error)
                                  toast({
                                    title: "Error",
                                    description: "Failed to delete patient. Please try again.",
                                    variant: "destructive",
                                  })
                                }
                              }}
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
      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
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
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      )}
    </div>
  )
} 