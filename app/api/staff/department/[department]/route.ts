import { type NextRequest, NextResponse } from "next/server"
import type { Staff } from "@/types/staff"

// Mock data - this would be imported from a shared source in a real app
const staffData: Staff[] = [
  {
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
  },
  {
    id: 2,
    fullName: "Nurse Sarah Johnson",
    email: "sarah.johnson@hospital.com",
    phoneNumber: "+1 (555) 234-5678",
    address: "456 Nursing Blvd, Healthcare City, HC 12345",
    dateOfBirth: "1988-09-22",
    gender: "Female",
    staffType: "NURSE",
    department: "Emergency",
    position: "Head Nurse",
    qualifications: ["BSN", "RN"],
    specializations: ["Emergency Care", "Trauma Care"],
    joiningDate: "2017-06-15",
    active: true,
  },
  {
    id: 3,
    fullName: "Admin Michael Brown",
    email: "michael.brown@hospital.com",
    phoneNumber: "+1 (555) 345-6789",
    address: "789 Admin Street, Healthcare City, HC 12345",
    dateOfBirth: "1975-12-03",
    gender: "Male",
    staffType: "ADMIN",
    department: "Administration",
    position: "Hospital Administrator",
    qualifications: ["MBA", "MHA"],
    specializations: ["Healthcare Management", "Hospital Operations"],
    joiningDate: "2010-01-20",
    active: true,
  },
  {
    id: 4,
    fullName: "Dr. Emily Davis",
    email: "emily.davis@hospital.com",
    phoneNumber: "+1 (555) 456-7890",
    address: "101 Doctor Lane, Healthcare City, HC 12345",
    dateOfBirth: "1983-07-18",
    gender: "Female",
    staffType: "DOCTOR",
    department: "Neurology",
    position: "Neurologist",
    qualifications: ["MD", "PhD"],
    specializations: ["Clinical Neurology", "Neurodegenerative Diseases"],
    joiningDate: "2016-09-05",
    active: true,
  },
  {
    id: 5,
    fullName: "Nurse Robert Wilson",
    email: "robert.wilson@hospital.com",
    phoneNumber: "+1 (555) 567-8901",
    address: "202 Nursing Circle, Healthcare City, HC 12345",
    dateOfBirth: "1990-02-25",
    gender: "Male",
    staffType: "NURSE",
    department: "Pediatrics",
    position: "Pediatric Nurse",
    qualifications: ["BSN", "RN", "PNCB"],
    specializations: ["Pediatric Care", "Neonatal Care"],
    joiningDate: "2018-04-12",
    active: false,
  },
]

// GET staff by department
export async function GET(request: NextRequest, { params }: { params: { department: string } }) {
  const department = params.department

  const filteredStaff = staffData.filter((staff) => staff.department.toLowerCase() === department.toLowerCase())

  return NextResponse.json({
    status: 1073741824,
    message: `Staff in department ${department} retrieved successfully`,
    data: filteredStaff,
  })
}
