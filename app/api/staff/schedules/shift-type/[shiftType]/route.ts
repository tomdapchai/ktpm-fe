import { type NextRequest, NextResponse } from "next/server"
import type { Schedule, ShiftType } from "@/types/schedule"
import api from "@/lib/axios"
import { AxiosError } from "axios"

// GET schedules by shift type
export async function GET(request: NextRequest, { params }: { params: { shiftType: string } }) {
  const shiftType = params.shiftType as ShiftType

  // Validate shift type
  if (!["MORNING", "AFTERNOON", "NIGHT", "ON_CALL", "EMERGENCY"].includes(shiftType)) {
    return NextResponse.json(
      {
        status: 0,
        message: `Invalid shift type ${params.shiftType}`,
        data: [],
      },
      { status: 400 },
    )
  }

  try {
    const response = await api.get(`/staff/schedules/shift-type/${shiftType}`)
    const schedules: Schedule[] = response.data.data

    return NextResponse.json({
      status: 1073741824,
      message: "Schedules retrieved successfully",
      data: schedules,
    })
  } catch (error: unknown) {
    const axiosError = error as AxiosError<any>
    console.error("Error retrieving schedules:", axiosError)
    // if 401
    if (axiosError.response && axiosError.response.status === 401) {
      return NextResponse.json(
        {
          status: 0,
          message: "Unauthorized",
          data: null,
        },
        { status: 401 },
      )
    }
    return NextResponse.json(
      {
        status: 0,
        message: "Failed to retrieve schedules",
        data: null,
      },
      { status: 500 },
    )
  }
}
