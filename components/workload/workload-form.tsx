"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { createWorkload, updateWorkload, getWorkloadById } from "@/lib/api/workload-api"
import { fetchStaff } from "@/lib/api/staff-api"
import type { WorkloadRequest } from "@/types/workload"
import type { Staff } from "@/types/staff"
import { workloadFormSchema } from "@/lib/validation"

type WorkloadFormValues = z.infer<typeof workloadFormSchema>

interface WorkloadFormProps {
  id?: string
}

export function WorkloadForm({ id }: WorkloadFormProps = {}) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(!!id)
  const [staff, setStaff] = useState<Staff[]>([])

  // Initialize the form
  const form = useForm<WorkloadFormValues>({
    resolver: zodResolver(workloadFormSchema),
    defaultValues: {
      staffId: "",
      patientCount: 0,
      appointmentCount: 0,
      procedureCount: 0,
      surgeryCount: 0,
      consultationCount: 0,
      hoursWorked: 0,
      notes: "",
    },
  })

  // Fetch staff data
  useEffect(() => {
    const loadStaff = async () => {
      try {
        const staffData = await fetchStaff()
        setStaff(staffData)
      } catch (error) {
        console.error("Failed to fetch staff:", error)
        toast({
          title: "Error",
          description: "Failed to load staff data. Please try again.",
          variant: "destructive",
        })
      }
    }

    loadStaff()
  }, [toast])

  // Fetch workload data if editing
  useEffect(() => {
    if (id) {
      const fetchWorkloadData = async () => {
        try {
          const workloadData = await getWorkloadById(Number.parseInt(id))

          // Format date for the form
          const formattedData = {
            ...workloadData,
            staffId: workloadData.staffId.toString(),
            date: new Date(workloadData.date),
          }

          form.reset(formattedData)
        } catch (error) {
          console.error("Failed to fetch workload data:", error)
          toast({
            title: "Error",
            description: "Failed to load workload data. Please try again.",
            variant: "destructive",
          })
        } finally {
          setInitialLoading(false)
        }
      }

      fetchWorkloadData()
    }
  }, [id, form, toast])

  // Handle form submission
  const onSubmit = async (data: WorkloadFormValues) => {
    setLoading(true)
    try {
      // Convert form data to API request format
      const workloadRequest: WorkloadRequest = {
        ...data,
        staffId: Number.parseInt(data.staffId),
        date: format(data.date, "yyyy-MM-dd"),
      }

      if (id) {
        // Update existing workload
        await updateWorkload(Number.parseInt(id), workloadRequest)
        toast({
          title: "Success",
          description: "Workload record has been updated successfully.",
        })
      } else {
        // Create new workload
        await createWorkload(workloadRequest)
        toast({
          title: "Success",
          description: "New workload record has been created successfully.",
        })
      }

      // Redirect to workload list
      router.push("/admin/staff/workload")
      router.refresh()
    } catch (error) {
      console.error("Failed to save workload:", error)
      toast({
        title: "Error",
        description: "Failed to save workload data. Please try again.",
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
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
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            autoFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Workload Metrics */}
            <div className="space-y-6 md:col-span-2">
              <h2 className="text-xl font-semibold">Workload Metrics</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="patientCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient Count</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="appointmentCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Appointment Count</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="procedureCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Procedure Count</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="surgeryCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Surgery Count</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="consultationCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consultation Count</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hoursWorked"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hours Worked</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="24" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Additional notes about the workload" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/staff/workload")}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {id ? "Update Workload" : "Record Workload"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
