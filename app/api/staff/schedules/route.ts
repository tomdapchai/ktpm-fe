import { type NextRequest, NextResponse } from "next/server"
import type { Schedule, ScheduleRequest } from "@/types/schedule"
import api from "@/lib/axios"
import { AxiosError } from "axios"


// GET all schedules
export async function GET() {
    try {
        const response = await api.get("/staff/schedules")
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

// POST new schedule
export async function POST(request: NextRequest) {
    try {
        const scheduleRequest: ScheduleRequest = await request.json()
        const response = await api.post("/staff/schedules", scheduleRequest)
        const schedule: Schedule = response.data.data
    
        return NextResponse.json({
        status: 1073741824,
        message: "Schedule created successfully",
        data: schedule,
        })
    } catch (error: unknown) {
        const axiosError = error as AxiosError<any>
        console.error("Error creating schedule:", axiosError)
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
            message: "Failed to create schedule",
            data: null,
        },
        { status: 500 },
        )
    }
}
