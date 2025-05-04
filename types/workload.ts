export interface Workload {
    id: number
    staffId: number
    date: string
    patientCount: number
    appointmentCount: number
    procedureCount: number
    surgeryCount: number
    consultationCount: number
    hoursWorked: number
    notes?: string
  }
  
  export interface WorkloadRequest {
    staffId: number
    date: string
    patientCount: number
    appointmentCount: number
    procedureCount: number
    surgeryCount: number
    consultationCount: number
    hoursWorked: number
    notes?: string
  }
  
  export interface WorkloadFilters {
    staffId: string
    date?: Date
    startDate?: Date
    endDate?: Date
  }
  