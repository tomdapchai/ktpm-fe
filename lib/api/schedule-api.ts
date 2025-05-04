import type { Schedule, ScheduleRequest } from "@/types/schedule"
import { getStaffById } from "./staff-api"

// Fetch all schedules
export async function fetchSchedules(endpoint = "/api/staff/schedules"): Promise<Schedule[]> {
  try {
    console.log("Fetching schedules from:", endpoint)
    const response = await fetch(endpoint)

    if (!response.ok) {
      throw new Error(`Failed to fetch schedules: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Error fetching schedules:", error)
    throw error
  }
}

// Get schedule by ID
export async function getScheduleById(id: number): Promise<Schedule> {
  try {
    const response = await fetch(`/api/staff/schedules/${id}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch schedule: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error(`Error fetching schedule with ID ${id}:`, error)
    throw error
  }
}

// Create new schedule
export async function createSchedule(scheduleRequest: ScheduleRequest): Promise<Schedule> {
  try {
    const response = await fetch("/api/staff/schedules", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(scheduleRequest),
    })

    if (!response.ok) {
      throw new Error(`Failed to create schedule: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error("Error creating schedule:", error)
    throw error
  }
}

// Update schedule
export async function updateSchedule(id: number, scheduleRequest: ScheduleRequest): Promise<Schedule> {
  try {
    const response = await fetch(`/api/staff/schedules/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(scheduleRequest),
    })

    if (!response.ok) {
      throw new Error(`Failed to update schedule: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error(`Error updating schedule with ID ${id}:`, error)
    throw error
  }
}

// Delete schedule
export async function deleteSchedule(id: number): Promise<void> {
  try {
    const response = await fetch(`/api/staff/schedules/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`Failed to delete schedule: ${response.statusText}`)
    }
  } catch (error) {
    console.error(`Error deleting schedule with ID ${id}:`, error)
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

// Re-export getStaffById for convenience
export { getStaffById }
