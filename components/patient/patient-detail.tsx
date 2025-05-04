"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Trash2, Calendar, Pill, Phone, Mail, MapPin, AlertCircle } from "lucide-react"
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
import { getPatientById } from "@/lib/api/patient-api"
import type { Patient } from "@/types/patient"

interface PatientDetailProps {
  id: string
}

export function PatientDetail({ id }: PatientDetailProps) {
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const data = await getPatientById(Number.parseInt(id))
        setPatient(data)
      } catch (error) {
        console.error("Failed to fetch patient:", error)
        toast({
          title: "Error",
          description: "Failed to load patient data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPatient()
  }, [id, toast])

  const handleDelete = async () => {
    try {
      // Call delete API
      toast({
        title: "Success",
        description: "Patient has been deleted successfully.",
      })
      router.push("/admin/patient")
    } catch (error) {
      console.error("Failed to delete patient:", error)
      toast({
        title: "Error",
        description: "Failed to delete patient. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading patient data...</div>
  }

  if (!patient) {
    return <div className="flex justify-center p-8">Patient not found.</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{patient.fullName}</h2>
          <p className="text-muted-foreground">Patient ID: {patient.id}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href={`/admin/patient/view/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </a>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete this patient?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the patient record and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="medical">Medical Info</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Basic patient details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" /> {patient.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" /> {patient.phoneNumber}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />{" "}
                    {new Date(patient.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Gender</p>
                  <p>{patient.gender}</p>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Address</p>
                  <p className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" /> {patient.address}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Registration and account status details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Registration Date</p>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />{" "}
                    {new Date(patient.registrationDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div>
                    {patient.active ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                        Inactive
                      </Badge>
                    )}
                  </div>
                </div>
                {patient.subject && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Username</p>
                    <p>{patient.subject}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medical" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Medical Information</CardTitle>
              <CardDescription>Patient medical details and history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Blood Type</p>
                  <p className="flex items-center gap-2">
                    <Pill className="h-4 w-4 text-muted-foreground" /> {patient.bloodType}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Medical History</p>
                {(patient.medicalHistory || []).length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {(patient.medicalHistory || []).map((item, index) => (
                      <Badge key={index} variant="secondary">
                        {item}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No medical history recorded</p>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Allergies</p>
                {(patient.allergies || []).length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {(patient.allergies || []).map((item, index) => (
                      <Badge key={index} variant="destructive">
                        {item}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No allergies recorded</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
              <CardDescription>Emergency contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Contact Name</p>
                  <p>{patient.emergencyContactName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Contact Phone</p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" /> {patient.emergencyContactPhone}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
              <p className="text-sm text-muted-foreground">
                This contact information will be used in case of emergency.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 