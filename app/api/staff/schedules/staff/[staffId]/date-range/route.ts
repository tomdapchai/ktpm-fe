import { type NextRequest, NextResponse } from "next/server"
import type { Schedule } from "@/types/schedule"
import api from "@/lib/axios"
import { AxiosError } from "axios"

// GET schedules by staff ID and date range
export async function GET(request: NextRequest, { params }: { params: { staffId: string } }) {
  const staffId = Number.parseInt(params.staffId)
  const { searchParams } = new URL(request.url)

  const start = searchParams.get("startTime")
  const end = searchParams.get("endTime")

  if (!start || !end) {
    return NextResponse.json(
      {
        status: 0,
        message: "Start time and end time are required",
        data: null,
      },
      { status: 400 },
    )
  }

    try {
        const response = await api.get(`/staff/schedules/staff/${staffId}/date-range`, {
        params: { start, end },
        })
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
