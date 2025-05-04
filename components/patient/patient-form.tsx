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
import { createPatient, updatePatient, getPatientById } from "@/lib/api/patient-api"
import type { PatientRequest } from "@/types/patient"
import { patientFormSchema } from "@/lib/validation"

type PatientFormValues = z.infer<typeof patientFormSchema>

interface PatientFormProps {
  id?: string
}

export function PatientForm({ id }: PatientFormProps = {}) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(!!id)
  const [newMedicalHistory, setNewMedicalHistory] = useState("")
  const [newAllergy, setNewAllergy] = useState("")
  const [bloodTypes, setBloodTypes] = useState<string[]>([
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
  ])

  // Initialize the form
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      address: "",
      dateOfBirth: new Date(),
      gender: "",
      bloodType: "",
      medicalHistory: [],
      allergies: [],
      emergencyContactName: "",
      emergencyContactPhone: "",
      registrationDate: new Date(),
      active: true,
      subject: "",
    },
  })

  // Fetch patient data if editing
  useEffect(() => {
    if (id) {
      const fetchPatientData = async () => {
        try {
          const patientData = await getPatientById(Number.parseInt(id))

          // Format dates for the form
          const formattedData = {
            ...patientData,
            dateOfBirth: new Date(patientData.dateOfBirth),
            registrationDate: new Date(patientData.registrationDate),
            // Don't include password in edit mode
            password: undefined,
            // Ensure arrays are never null
            medicalHistory: patientData.medicalHistory || [],
            allergies: patientData.allergies || [],
          }

          // Reset form with fetched data and then set loading to false
          form.reset(formattedData)
          setInitialLoading(false)
        } catch (error) {
          console.error("Failed to fetch patient data:", error)
          toast({
            title: "Error",
            description: "Failed to load patient data. Please try again.",
            variant: "destructive",
          })
          setInitialLoading(false)
        }
      }

      fetchPatientData()
    }
  }, [id, form, toast])

  // Handle form submission
  const onSubmit = async (data: PatientFormValues) => {
    setLoading(true)
    try {
      console.log("Form data before conversion:", data);
      
      // Convert form data to API request format
      const patientRequest: PatientRequest = {
        ...data,
        // Ensure date fields are properly formatted strings
        dateOfBirth: format(data.dateOfBirth, "yyyy-MM-dd"),
        registrationDate: format(data.registrationDate, "yyyy-MM-dd"),
        // Ensure arrays are never null
        medicalHistory: data.medicalHistory || [],
        allergies: data.allergies || [],
      }
      
      console.log("PatientRequest after conversion:", patientRequest);

      if (id) {
        // Update existing patient
        await updatePatient(Number.parseInt(id), patientRequest)
        toast({
          title: "Success",
          description: "Patient has been updated successfully.",
        })
      } else {
        // Create new patient
        const result = await createPatient(patientRequest)
        console.log("Create patient response:", result);
        toast({
          title: "Success",
          description: "New patient has been created successfully.",
        })
      }

      // Redirect to patient list
      router.push("/admin/patient")
      router.refresh()
    } catch (error) {
      console.error("Failed to save patient:", error)
      toast({
        title: "Error",
        description: "Failed to save patient data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle adding a new medical history item
  const addMedicalHistory = () => {
    if (newMedicalHistory.trim() === "") return

    const currentMedicalHistory = form.getValues("medicalHistory") || []
    form.setValue("medicalHistory", [...currentMedicalHistory, newMedicalHistory.trim()])
    setNewMedicalHistory("")
  }

  // Handle removing a medical history item
  const removeMedicalHistory = (index: number) => {
    const currentMedicalHistory = form.getValues("medicalHistory") || []
    form.setValue(
      "medicalHistory",
      currentMedicalHistory.filter((_, i) => i !== index),
    )
  }

  // Handle adding a new allergy
  const addAllergy = () => {
    if (newAllergy.trim() === "") return

    const currentAllergies = form.getValues("allergies") || []
    form.setValue("allergies", [...currentAllergies, newAllergy.trim()])
    setNewAllergy("")
  }

  // Handle removing an allergy
  const removeAllergy = (index: number) => {
    const currentAllergies = form.getValues("allergies") || []
    form.setValue(
      "allergies",
      currentAllergies.filter((_, i) => i !== index),
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
                      <Input placeholder="John Doe" value={field.value || ""} onChange={field.onChange} />
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
                        <Input type="email" placeholder="john.doe@example.com" value={field.value || ""} onChange={field.onChange} />
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
                        <Input placeholder="+1 (555) 123-4567" value={field.value || ""} onChange={field.onChange} />
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
                      <Textarea placeholder="123 Main St, City, Country" value={field.value || ""} onChange={field.onChange} />
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

            {/* Medical Information */}
            <div className="space-y-6 md:col-span-2">
              <h2 className="text-xl font-semibold">Medical Information</h2>

              <FormField
                control={form.control}
                name="bloodType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bloodTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Medical History Section */}
              <FormField
                control={form.control}
                name="medicalHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical History</FormLabel>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            placeholder="Add medical history item"
                            value={newMedicalHistory}
                            onChange={(e) => setNewMedicalHistory(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addMedicalHistory())}
                          />
                        </FormControl>
                        <Button type="button" variant="outline" size="icon" onClick={addMedicalHistory}>
                          <Plus className="h-4 w-4" />
                          <span className="sr-only">Add medical history item</span>
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {field.value?.map((item, index) => (
                          <Badge key={index} variant="secondary" className="px-2 py-1 text-sm">
                            {item}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 ml-1"
                              onClick={() => removeMedicalHistory(index)}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove {item}</span>
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Allergies Section */}
              <FormField
                control={form.control}
                name="allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allergies</FormLabel>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            placeholder="Add allergy"
                            value={newAllergy}
                            onChange={(e) => setNewAllergy(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAllergy())}
                          />
                        </FormControl>
                        <Button type="button" variant="outline" size="icon" onClick={addAllergy}>
                          <Plus className="h-4 w-4" />
                          <span className="sr-only">Add allergy</span>
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {field.value?.map((item, index) => (
                          <Badge key={index} variant="secondary" className="px-2 py-1 text-sm">
                            {item}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 ml-1"
                              onClick={() => removeAllergy(index)}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove {item}</span>
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Emergency Contact Information */}
            <div className="space-y-6 md:col-span-2">
              <h2 className="text-xl font-semibold">Emergency Contact</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="emergencyContactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Doe" value={field.value || ""} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyContactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 987-6543" value={field.value || ""} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-6 md:col-span-2">
              <h2 className="text-xl font-semibold">Account Information</h2>

              <FormField
                control={form.control}
                name="registrationDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Registration Date</FormLabel>
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
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!id && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" value={field.value || ""} onChange={field.onChange} />
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
                    <FormLabel>Subject (Optional - Username for login)</FormLabel>
                    <FormControl>
                      <Input placeholder="Subject" value={field.value || ""} onChange={field.onChange} />
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
                      <FormDescription>Mark this patient as active or inactive.</FormDescription>
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
            <Button type="button" variant="outline" onClick={() => router.push("/admin/patient")}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {id ? "Update Patient" : "Create Patient"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
} 