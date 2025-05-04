"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Edit, Trash2, Calendar, Clock, Users, FileText, Activity } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { getWorkloadById, deleteWorkload } from "@/lib/api/workload-api"
import { getStaffById } from "@/lib/api/staff-api"
import type { Workload } from "@/types/workload"
import type { Staff } from "@/types/staff"

interface WorkloadDetailProps {
  id: string
}

export function WorkloadDetail({ id }: WorkloadDetailProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [workload, setWorkload] = useState<Workload | null>(null)
  const [staff, setStaff] = useState<Staff | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWorkloadData = async () => {
      try {
        const data = await getWorkloadById(Number.parseInt(id))
        setWorkload(data)

        // Fetch staff details
        try {
          const staffData = await getStaffById(data.staffId)
          setStaff(staffData)
        } catch (error) {
          console.error("Failed to fetch staff data:", error)
        }
      } catch (error) {
        console.error("Failed to fetch workload data:", error)
        toast({
          title: "Error",
          description: "Failed to load workload data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchWorkloadData()
  }, [id, toast])

  const handleDelete = async () => {
    try {
      await deleteWorkload(Number.parseInt(id))
      toast({
        title: "Success",
        description: "Workload record has been deleted successfully.",
      })
      router.push("/admin/staff/workload")
      router.refresh()
    } catch (error) {
      console.error("Failed to delete workload:", error)
      toast({
        title: "Error",
        description: "Failed to delete workload record. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading workload data...</div>
  }

  if (!workload) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h2 className="text-xl font-semibold mb-2">Workload Record Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The workload record you are looking for does not exist or has been removed.
        </p>
        <Button onClick={() => router.push("/admin/staff/workload")}>Back to Workload List</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Workload Record #{workload.id}</h2>
          <p className="text-muted-foreground">
            {staff?.fullName || `Staff ID: ${workload.staffId}`} - {format(new Date(workload.date), "MMMM dd, yyyy")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href={`/admin/staff/workload/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </a>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
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
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Details about the workload record.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-2">
              <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Staff Member</p>
                <p className="text-muted-foreground">
                  {staff ? (
                    <>
                      {staff.fullName} ({staff.staffType} - {staff.department})
                    </>
                  ) : (
                    `Staff ID: ${workload.staffId}`
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Date</p>
                <p className="text-muted-foreground">{format(new Date(workload.date), "MMMM dd, yyyy")}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Hours Worked</p>
                <p className="text-muted-foreground">{workload.hoursWorked.toFixed(1)} hours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workload Metrics</CardTitle>
            <CardDescription>Detailed metrics for this workload record.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Patient Count</p>
                <p className="text-2xl font-bold">{workload.patientCount}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Appointment Count</p>
                <p className="text-2xl font-bold">{workload.appointmentCount}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Procedure Count</p>
                <p className="text-2xl font-bold">{workload.procedureCount}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Surgery Count</p>
                <p className="text-2xl font-bold">{workload.surgeryCount}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Consultation Count</p>
                <p className="text-2xl font-bold">{workload.consultationCount}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Activities</p>
                <p className="text-2xl font-bold">
                  {workload.patientCount +
                    workload.appointmentCount +
                    workload.procedureCount +
                    workload.surgeryCount +
                    workload.consultationCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {workload.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>Additional information about this workload.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-2">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <p className="text-muted-foreground">{workload.notes}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Workload Analysis</CardTitle>
          <CardDescription>Performance metrics and analysis.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <Activity className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Efficiency Metrics</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div className="p-4 border rounded-md">
                    <p className="text-sm text-muted-foreground">Patients per Hour</p>
                    <p className="text-xl font-bold">
                      {workload.hoursWorked > 0 ? (workload.patientCount / workload.hoursWorked).toFixed(1) : "N/A"}
                    </p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <p className="text-sm text-muted-foreground">Procedures per Hour</p>
                    <p className="text-xl font-bold">
                      {workload.hoursWorked > 0 ? (workload.procedureCount / workload.hoursWorked).toFixed(1) : "N/A"}
                    </p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <p className="text-sm text-muted-foreground">Total Activities per Hour</p>
                    <p className="text-xl font-bold">
                      {workload.hoursWorked > 0
                        ? (
                            (workload.patientCount +
                              workload.appointmentCount +
                              workload.procedureCount +
                              workload.surgeryCount +
                              workload.consultationCount) /
                            workload.hoursWorked
                          ).toFixed(1)
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <p className="text-sm text-muted-foreground">
            This analysis is based on the recorded metrics and may not reflect all aspects of staff performance.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
