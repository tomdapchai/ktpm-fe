import type { Patient, PatientRequest } from "@/types/patient"

// Fetch all patients
export async function fetchPatients(endpoint = "/api/patient"): Promise<Patient[]> {
  try {
    const response = await fetch(endpoint)

    if (!response.ok) {
      throw new Error(`Failed to fetch patients: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Error fetching patients:", error)
    throw error
  }
}

// Get patient by ID
export async function getPatientById(id: number): Promise<Patient> {
  try {
    const response = await fetch(`/api/patient/${id}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch patient: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error(`Error fetching patient with ID ${id}:`, error)
    throw error
  }
}

// Create new patient
export async function createPatient(patientRequest: PatientRequest): Promise<Patient> {
  try {
    const response = await fetch("/api/patient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patientRequest),
    })

    if (!response.ok) {
      throw new Error(`Failed to create patient: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error("Error creating patient:", error)
    throw error
  }
}

// Update patient
export async function updatePatient(id: number, patientRequest: PatientRequest): Promise<Patient> {
  try {
    const response = await fetch(`/api/patient/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patientRequest),
    })

    if (!response.ok) {
      throw new Error(`Failed to update patient: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error(`Error updating patient with ID ${id}:`, error)
    throw error
  }
} 