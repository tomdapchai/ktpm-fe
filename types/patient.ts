export interface Patient {
  id: number
  fullName: string
  email: string
  phoneNumber: string
  address: string
  dateOfBirth: string
  gender: string
  bloodType: string
  medicalHistory: string[]
  allergies: string[]
  emergencyContactName: string
  emergencyContactPhone: string
  registrationDate: string
  active: boolean
  subject?: string
}

export interface PatientRequest {
  fullName: string
  email: string
  phoneNumber: string
  address: string
  dateOfBirth: string
  gender: string
  bloodType: string
  medicalHistory: string[]
  allergies: string[]
  emergencyContactName: string
  emergencyContactPhone: string
  registrationDate: string
  active: boolean
  password?: string
  subject?: string
}

export interface PatientFilters {
  bloodType: string
  gender: string
  activeOnly: boolean
} 