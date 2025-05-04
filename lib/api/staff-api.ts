import type { Staff, StaffRequest } from "@/types/staff"

// Fetch all staff
export async function fetchStaff(endpoint = "/api/staff"): Promise<Staff[]> {
  try {
    const response = await fetch(endpoint)

    if (!response.ok) {
      throw new Error(`Failed to fetch staff: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Error fetching staff:", error)
    throw error
  }
}

// Get staff by ID
export async function getStaffById(id: number): Promise<Staff> {
  try {
    const response = await fetch(`/api/staff/${id}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch staff: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error(`Error fetching staff with ID ${id}:`, error)
    throw error
  }
}

// Create new staff
export async function createStaff(staffRequest: StaffRequest): Promise<Staff> {
  try {
    const response = await fetch("/api/staff", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(staffRequest),
    })

    if (!response.ok) {
      throw new Error(`Failed to create staff: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error("Error creating staff:", error)
    throw error
  }
}

// Update staff
export async function updateStaff(id: number, staffRequest: StaffRequest): Promise<Staff> {
  try {
    const response = await fetch(`/api/staff/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(staffRequest),
    })

    if (!response.ok) {
      throw new Error(`Failed to update staff: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error(`Error updating staff with ID ${id}:`, error)
    throw error
  }
}

// Delete staff
export async function deleteStaff(id: number): Promise<void> {
  try {
    const response = await fetch(`/api/staff/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`Failed to delete staff: ${response.statusText}`)
    }
  } catch (error) {
    console.error(`Error deleting staff with ID ${id}:`, error)
    throw error
  }
}

// Fetch departments (mock function - in a real app, this would call an API)
export async function fetchDepartments(): Promise<string[]> {
  // This would be an API call in a real application
  return [
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
  ]
}

// Fetch specializations (mock function - in a real app, this would call an API)
export async function fetchSpecializations(): Promise<string[]> {
  // This would be an API call in a real application
  return [
    "Cardiac Surgery",
    "Neurosurgery",
    "Pediatric Cardiology",
    "Medical Oncology",
    "Emergency Medicine",
    "Diagnostic Radiology",
    "General Surgery",
    "Orthopedic Surgery",
    "Child Psychiatry",
    "Dermatopathology",
  ]
}
