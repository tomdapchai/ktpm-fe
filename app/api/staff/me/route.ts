import { NextResponse } from "next/server"
import type { Staff } from "@/types/staff"

// In a real application, this would use authentication to get the current user
// For this demo, we'll just return a mock staff member

export async function GET() {
  // Mock current user - in a real app, this would be determined from the session
  const currentUser: Staff = {
    id: 1,
    fullName: "Dr. John Smith",
    email: "john.smith@hospital.com",
    phoneNumber: "+1 (555) 123-4567",
    address: "123 Medical Drive, Healthcare City, HC 12345",
    dateOfBirth: "1980-05-15",
    gender: "Male",
    staffType: "DOCTOR",
    department: "Cardiology",
    position: "Senior Cardiologist",
    qualifications: ["MD", "PhD", "FACC"],
    specializations: ["Interventional Cardiology", "Cardiac Electrophysiology"],
    joiningDate: "2015-03-10",
    active: true,
  }

  return NextResponse.json({
    status: 1073741824,
    message: "Current staff member retrieved successfully",
    data: currentUser,
  })
}
