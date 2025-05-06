"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Loader2, X, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { createStaff, updateStaff, getStaffById } from "@/lib/api/staff-api"
import type { StaffRequest } from "@/types/staff"
import { staffFormSchema } from "@/lib/validation"
// Define the form schema with Zod


type StaffFormValues = z.infer<typeof staffFormSchema>

interface StaffFormProps {
  id?: string
}

export function StaffForm({ id }: StaffFormProps = {}) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(!!id)
  const [newQualification, setNewQualification] = useState("")
  const [newSpecialization, setNewSpecialization] = useState("")
  const [departments, setDepartments] = useState<string[]>([
    "Cardiology",
    "Neurology",
    "Pediatrics",
    "Oncology",
    "Emergency",
    "Radiology",
    "Surgery",
    "Orthopedics",
    "Psychiatry",
    "Dermatology",
  ])

  // Initialize the form
  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      address: "",
      gender: "",
      staffType: "DOCTOR" as const,
      department: "",
      position: "",
      qualifications: [],
      specializations: [],
      active: true,
      subject: "",
    },
  })

  // Fetch staff data if editing
  useEffect(() => {
    if (id) {
      const fetchStaffData = async () => {
        try {
          const staffData = await getStaffById(Number.parseInt(id))

          // Format dates for the form
          const formattedData = {
            ...staffData,
            dateOfBirth: new Date(staffData.dateOfBirth),
            joiningDate: new Date(staffData.joiningDate),
            // Don't include password in edit mode
            password: undefined,
          }

          form.reset(formattedData)
        } catch (error) {
          console.error("Failed to fetch staff data:", error)
          toast({
            title: "Error",
            description: "Failed to load staff data. Please try again.",
            variant: "destructive",
          })
        } finally {
          setInitialLoading(false)
        }
      }

      fetchStaffData()
    }
  }, [id, form, toast])

  // Handle form submission
  const onSubmit = async (data: StaffFormValues) => {
    setLoading(true)
    try {
      // Convert form data to API request format
      const staffRequest: StaffRequest = {
        ...data,
        dateOfBirth: format(data.dateOfBirth, "yyyy-MM-dd"),
        joiningDate: format(data.joiningDate, "yyyy-MM-dd"),
      }

      if (id) {
        // Update existing staff
        await updateStaff(Number.parseInt(id), staffRequest)
        toast({
          title: "Success",
          description: "Staff member has been updated successfully.",
        })
      } else {
        // Create new staff
        await createStaff(staffRequest)
        toast({
          title: "Success",
          description: "New staff member has been created successfully.",
        })
      }

      // Redirect to staff list
      router.push("/admin/staff")
      router.refresh()
    } catch (error) {
      console.error("Failed to save staff:", error)
      toast({
        title: "Error",
        description: "Failed to save staff data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle adding a new qualification
  const addQualification = () => {
    if (newQualification.trim() === "") return

    const currentQualifications = form.getValues("qualifications") || []
    form.setValue("qualifications", [...currentQualifications, newQualification.trim()])
    setNewQualification("")
  }

  // Handle removing a qualification
  const removeQualification = (index: number) => {
    const currentQualifications = form.getValues("qualifications") || []
    form.setValue(
      "qualifications",
      currentQualifications.filter((_, i) => i !== index),
    )
  }

  // Handle adding a new specialization
  const addSpecialization = () => {
    if (newSpecialization.trim() === "") return

    const currentSpecializations = form.getValues("specializations") || []
    form.setValue("specializations", [...currentSpecializations, newSpecialization.trim()])
    setNewSpecialization("")
  }

  // Handle removing a specialization
  const removeSpecialization = (index: number) => {
    const currentSpecializations = form.getValues("specializations") || []
    form.setValue(
      "specializations",
      currentSpecializations.filter((_, i) => i !== index),
    )
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
            {/* Personal Information */}
            <div className="space-y-6 md:col-span-2">
              <h2 className="text-xl font-semibold">Personal Information</h2>

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="123 Main St, City, Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Birth</FormLabel>
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
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                          autoFocus
                          showOutsideDays = {false}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-6 md:col-span-2">
              <h2 className="text-xl font-semibold">Professional Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="staffType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Staff Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select staff type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="DOCTOR">Doctor</SelectItem>
                          <SelectItem value="NURSE">Nurse</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
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
              </div>

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input placeholder="Senior Doctor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="joiningDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Joining Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
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
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="qualifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qualifications</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add qualification"
                            value={newQualification}
                            onChange={(e) => setNewQualification(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                addQualification()
                              }
                            }}
                          />
                          <Button type="button" onClick={addQualification}>
                            <Plus className="h-4 w-4" />
                            <span className="sr-only">Add</span>
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {field.value?.map((qualification, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {qualification}
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() => removeQualification(index)}
                              >
                                <X className="h-3 w-3" />
                                <span className="sr-only">Remove</span>
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specializations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specializations</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add specialization"
                            value={newSpecialization}
                            onChange={(e) => setNewSpecialization(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                addSpecialization()
                              }
                            }}
                          />
                          <Button type="button" onClick={addSpecialization}>
                            <Plus className="h-4 w-4" />
                            <span className="sr-only">Add</span>
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {field.value?.map((specialization, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {specialization}
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() => removeSpecialization(index)}
                              >
                                <X className="h-3 w-3" />
                                <span className="sr-only">Remove</span>
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Account Information */}
            <div className="space-y-6 md:col-span-2">
              <h2 className="text-xl font-semibold">Account Information</h2>

              {!id && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormDescription>Password must be at least 6 characters.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Subject" {...field} />
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
                      <FormDescription>Mark this staff member as active or inactive.</FormDescription>
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
            <Button type="button" variant="outline" onClick={() => router.push("/admin/staff")}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {id ? "Update Staff" : "Create Staff"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
