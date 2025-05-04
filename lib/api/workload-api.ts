import type { Workload, WorkloadRequest } from "@/types/workload"
import { getStaffById } from "./staff-api"

// Fetch all workloads
export async function fetchWorkloads(endpoint = "/api/staff/workloads"): Promise<Workload[]> {
  try {
    const response = await fetch(endpoint)

    if (!response.ok) {
      throw new Error(`Failed to fetch workloads: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Error fetching workloads:", error)
    throw error
  }
}

// Get workload by ID
export async function getWorkloadById(id: number): Promise<Workload> {
  try {
    const response = await fetch(`/api/staff/workloads/${id}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch workload: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error(`Error fetching workload with ID ${id}:`, error)
    throw error
  }
}

// Create new workload
export async function createWorkload(workloadRequest: WorkloadRequest): Promise<Workload> {
  try {
    const response = await fetch("/api/staff/workloads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workloadRequest),
    })

    if (!response.ok) {
      throw new Error(`Failed to create workload: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error("Error creating workload:", error)
    throw error
  }
}

// Update workload
export async function updateWorkload(id: number, workloadRequest: WorkloadRequest): Promise<Workload> {
  try {
    const response = await fetch(`/api/staff/workloads/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workloadRequest),
    })

    if (!response.ok) {
      throw new Error(`Failed to update workload: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error(`Error updating workload with ID ${id}:`, error)
    throw error
  }
}

// Delete workload
export async function deleteWorkload(id: number): Promise<void> {
  try {
    const response = await fetch(`/api/staff/workloads/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`Failed to delete workload: ${response.statusText}`)
    }
  } catch (error) {
    console.error(`Error deleting workload with ID ${id}:`, error)
    throw error
  }
}

// Re-export getStaffById for convenience
export { getStaffById }
