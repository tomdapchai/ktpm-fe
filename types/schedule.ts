export type ShiftType = "MORNING" | "AFTERNOON" | "NIGHT" | "ON_CALL" | "EMERGENCY"

export interface Schedule {
  id: number
  staffId: number
  startTime: string
  endTime: string
  shiftType: ShiftType
  department: string
  notes?: string
  active: boolean
}

export interface ScheduleRequest {
  staffId: number
  startTime: string
  endTime: string
  shiftType: ShiftType
  department: string
  notes?: string
  active: boolean
}

export interface ScheduleFilters {
  staffId: string
  shiftType: string
  department: string
  startDate?: Date
  endDate?: Date
  activeOnly: boolean
}
