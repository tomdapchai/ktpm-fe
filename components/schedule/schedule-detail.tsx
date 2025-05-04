"use client"

import Link from "next/link"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Edit, Trash2, Calendar, Clock, Briefcase, FileText, User, Building } from "lucide-react"
import { format, differenceInHours, differenceInMinutes } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { getScheduleById, deleteSchedule } from "@/lib/api/schedule-api"
import { getStaffById } from "@/lib/api/staff-api"
import type { Schedule } from "@/types/schedule"
import type { Staff } from "@/types/staff"

interface ScheduleDetailProps {
  id: string
}

export function ScheduleDetail({ id }: ScheduleDetailProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [schedule, setSchedule] = useState<Schedule | null>(null)
  const [staff, setStaff] = useState<Staff | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        const data = await getScheduleById(Number.parseInt(id))
        setSchedule(data)

        // Fetch staff details
        try {
          const staffData = await getStaffById(data.staffId)
          setStaff(staffData)
        } catch (error) {
          console.error("Failed to fetch staff data:", error)
        }
      } catch (error) {
        console.error("Failed to fetch schedule data:", error)
        toast({
          title: "Error",
          description: "Failed to load schedule data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchScheduleData()
  }, [id, toast])

  const handleDelete = async () => {
    try {
      await deleteSchedule(Number.parseInt(id))
      toast({
        title: "Success",
        description: "Schedule has been deleted successfully.",
      })
      router.push("/admin/staff/schedule")
      router.refresh()
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

  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime)
    const end = new Date(endTime)
    const hours = differenceInHours(end, start)
    const minutes = differenceInMinutes(end, start) % 60

    return `${hours} hours${minutes > 0 ? ` ${minutes} minutes` : ""}`
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading schedule data...</div>
  }

  if (!schedule) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h2 className="text-xl font-semibold mb-2">Schedule Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The schedule you are looking for does not exist or has been removed.
        </p>
        <Button onClick={() => router.push("/admin/staff/schedule")}>Back to Schedule List</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">Schedule #{schedule.id}</h2>
            <Badge variant={getShiftTypeBadgeVariant(schedule.shiftType)}>{schedule.shiftType}</Badge>
            <Badge variant={schedule.active ? "success" : "destructive"}>
              {schedule.active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {staff?.fullName || `Staff ID: ${schedule.staffId}`} - {schedule.department}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href={`/admin/staff/schedule/${id}/edit`}>
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
                  This will permanently delete the schedule. This action cannot be undone.
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
            <CardTitle>Schedule Information</CardTitle>
            <CardDescription>Details about the schedule.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-2">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Staff Member</p>
                <p className="text-muted-foreground">
                  {staff ? (
                    <>
                      {staff.fullName} ({staff.staffType})
                    </>
                  ) : (
                    `Staff ID: ${schedule.staffId}`
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Department</p>
                <p className="text-muted-foreground">{schedule.department}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Shift Type</p>
                <Badge variant={getShiftTypeBadgeVariant(schedule.shiftType)} className="mt-1">
                  {schedule.shiftType}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Time Information</CardTitle>
            <CardDescription>Schedule timing details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Start Time</p>
                <p className="text-muted-foreground">{format(new Date(schedule.startTime), "PPP 'at' h:mm a")}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">End Time</p>
                <p className="text-muted-foreground">{format(new Date(schedule.endTime), "PPP 'at' h:mm a")}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Duration</p>
                <p className="text-muted-foreground">{calculateDuration(schedule.startTime, schedule.endTime)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {schedule.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>Additional information about this schedule.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-2">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <p className="text-muted-foreground">{schedule.notes}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {staff && (
        <Card>
          <CardHeader>
            <CardTitle>Staff Information</CardTitle>
            <CardDescription>Details about the assigned staff member.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Name</p>
                  <p className="text-muted-foreground">{staff.fullName}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Position</p>
                  <p className="text-muted-foreground">{staff.position}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Department</p>
                  <p className="text-muted-foreground">{staff.department}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div>
                  <p className="font-medium">Status</p>
                  <Badge variant={staff.active ? "success" : "destructive"} className="mt-1">
                    {staff.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href={`/admin/staff/view/${staff.id}`}>View Full Staff Profile</Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
