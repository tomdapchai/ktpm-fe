"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, addHours } from "date-fns"
import { CalendarIcon, Clock, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { createSchedule, updateSchedule, getScheduleById, fetchDepartments } from "@/lib/api/schedule-api"
import { fetchStaff } from "@/lib/api/staff-api"
import type { ScheduleRequest } from "@/types/schedule"
import type { Staff } from "@/types/staff"
import { Input } from "@/components/ui/input"

// Define the form schema with Zod
const scheduleFormSchema = z
  .object({
    staffId: z.string().min(1, { message: "Staff member is required" }),
    startDate: z.date({ required_error: "Start date is required" }),
    startHour: z.string().regex(/^([0-1]?[0-9]|2[0-3])$/, { message: "Hour must be between 0-23" }),
    startMinute: z.string().regex(/^[0-5]?[0-9]$/, { message: "Minute must be between 0-59" }),
    endDate: z.date({ required_error: "End date is required" }),
    endHour: z.string().regex(/^([0-1]?[0-9]|2[0-3])$/, { message: "Hour must be between 0-23" }),
    endMinute: z.string().regex(/^[0-5]?[0-9]$/, { message: "Minute must be between 0-59" }),
    shiftType: z.enum(["MORNING", "AFTERNOON", "NIGHT", "ON_CALL", "EMERGENCY"], {
      required_error: "Shift type is required",
    }),
    department: z.string().min(1, { message: "Department is required" }),
    notes: z.string().optional(),
    active: z.boolean().default(true),
  })
  .refine(
    (data) => {
      const startDateTime = new Date(data.startDate)
      startDateTime.setHours(Number.parseInt(data.startHour), Number.parseInt(data.startMinute))

      const endDateTime = new Date(data.endDate)
      endDateTime.setHours(Number.parseInt(data.endHour), Number.parseInt(data.endMinute))

      return endDateTime > startDateTime
    },
    {
      message: "End time must be after start time",
      path: ["endDate"],
    },
  )

type ScheduleFormValues = z.infer<typeof scheduleFormSchema>

interface ScheduleFormProps {
  id?: string
}

export function ScheduleForm({ id }: ScheduleFormProps = {}) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(!!id)
  const [staff, setStaff] = useState<Staff[]>([])
  const [departments, setDepartments] = useState<string[]>([])

  // Initialize the form
  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      staffId: "",
      startDate: new Date(),
      startHour: "9",
      startMinute: "0",
      endDate: addHours(new Date(), 8),
      endHour: "17",
      endMinute: "0",
      shiftType: "MORNING",
      department: "",
      notes: "",
      active: true,
    },
  })

  // Fetch staff and departments data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [staffData, departmentData] = await Promise.all([fetchStaff(), fetchDepartments()])
        setStaff(staffData)
        setDepartments(departmentData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
        toast({
          title: "Error",
          description: "Failed to load staff and department data. Please try again.",
          variant: "destructive",
        })
      }
    }

    loadData()
  }, [toast])

  // Fetch schedule data if editing
  useEffect(() => {
    if (id) {
      const fetchScheduleData = async () => {
        try {
          const scheduleData = await getScheduleById(Number.parseInt(id))

          // Format dates and times for the form
          const startDateTime = new Date(scheduleData.startTime)
          const endDateTime = new Date(scheduleData.endTime)

          const formattedData = {
            staffId: scheduleData.staffId.toString(),
            startDate: startDateTime,
            startHour: startDateTime.getHours().toString(),
            startMinute: startDateTime.getMinutes().toString(),
            endDate: endDateTime,
            endHour: endDateTime.getHours().toString(),
            endMinute: endDateTime.getMinutes().toString(),
            shiftType: scheduleData.shiftType,
            department: scheduleData.department,
            notes: scheduleData.notes || "",
            active: scheduleData.active,
          }

          form.reset(formattedData)
        } catch (error) {
          console.error("Failed to fetch schedule data:", error)
          toast({
            title: "Error",
            description: "Failed to load schedule data. Please try again.",
            variant: "destructive",
          })
        } finally {
          setInitialLoading(false)
        }
      }

      fetchScheduleData()
    }
  }, [id, form, toast])

  // Handle form submission
  const onSubmit = async (data: ScheduleFormValues) => {
    setLoading(true)
    try {
      // Create Date objects for start and end times
      const startDateTime = new Date(data.startDate)
      startDateTime.setHours(Number.parseInt(data.startHour), Number.parseInt(data.startMinute))

      const endDateTime = new Date(data.endDate)
      endDateTime.setHours(Number.parseInt(data.endHour), Number.parseInt(data.endMinute))

      // Convert form data to API request format
      const scheduleRequest: ScheduleRequest = {
        staffId: Number.parseInt(data.staffId),
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        shiftType: data.shiftType,
        department: data.department,
        notes: data.notes,
        active: data.active,
      }

      if (id) {
        // Update existing schedule
        await updateSchedule(Number.parseInt(id), scheduleRequest)
        toast({
          title: "Success",
          description: "Schedule has been updated successfully.",
        })
      } else {
        // Create new schedule
        await createSchedule(scheduleRequest)
        toast({
          title: "Success",
          description: "New schedule has been created successfully.",
        })
      }

      // Redirect to schedule list
      router.push("/admin/staff/schedule")
      router.refresh()
    } catch (error) {
      console.error("Failed to save schedule:", error)
      toast({
        title: "Error",
        description: "Failed to save schedule data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-6 md:col-span-2">
              <h2 className="text-xl font-semibold">Basic Information</h2>

              <FormField
                control={form.control}
                name="staffId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Staff Member</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select staff member" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {staff.map((member) => (
                          <SelectItem key={member.id} value={member.id.toString()}>
                            {member.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shiftType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shift Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select shift type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MORNING">Morning</SelectItem>
                        <SelectItem value="AFTERNOON">Afternoon</SelectItem>
                        <SelectItem value="NIGHT">Night</SelectItem>
                        <SelectItem value="ON_CALL">On Call</SelectItem>
                        <SelectItem value="EMERGENCY">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Schedule Timing */}
            <div className="space-y-6 md:col-span-2">
              <h2 className="text-xl font-semibold">Schedule Timing</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startHour"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Hour</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                              <Input type="number" min="0" max="23" placeholder="9" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="startMinute"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Minute</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" max="59" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="endHour"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Hour</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                              <Input type="number" min="0" max="23" placeholder="17" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endMinute"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Minute</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" max="59" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-6 md:col-span-2">
              <h2 className="text-xl font-semibold">Additional Information</h2>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Additional notes about the schedule" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <p className="text-sm text-muted-foreground">Mark this schedule as active or inactive.</p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/staff/schedule")}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {id ? "Update Schedule" : "Create Schedule"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
