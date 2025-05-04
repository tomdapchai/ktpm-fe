export type StaffType = "DOCTOR" | "NURSE" | "ADMIN"

export interface Staff {
  id: number
  fullName: string
  email: string
  phoneNumber: string
  address: string
  dateOfBirth: string
  gender: string
  staffType: StaffType
  department: string
  position: string
  qualifications: string[]
  specializations: string[]
  joiningDate: string
  active: boolean
  subject?: string
}

export interface StaffRequest {
  fullName: string
  email: string
  phoneNumber: string
  address: string
  dateOfBirth: string
  gender: string
  staffType: StaffType
  department: string
  position: string
  qualifications: string[]
  specializations: string[]
  joiningDate: string
  active: boolean
  password?: string
  subject?: string
}

export interface StaffFilters {
  staffType: string
  department: string
  specialization: string
  activeOnly: boolean
  searchTerm: string
}
