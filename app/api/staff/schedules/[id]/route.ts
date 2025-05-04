import { type NextRequest, NextResponse } from "next/server"
import type { Schedule, ScheduleRequest } from "@/types/schedule"
import api from "@/lib/axios"
import { AxiosError } from "axios"


// GET schedule by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = Number.parseInt(params.id)
        const response = await api.get(`/staff/schedules/${id}`)
        const schedule: Schedule = response.data.data

        return NextResponse.json({
            status: 1073741824,
            message: "Schedule retrieved successfully",
            data: schedule,
        })
    }
    catch (error: unknown) {
        const axiosError = error as AxiosError<any>
        console.error("Error retrieving schedule:", axiosError)
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
                message: "Failed to retrieve schedule",
                data: null,
            },
            { status: 500 },
        )
    }
}

// PUT (update) schedule by ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = Number.parseInt(params.id)
        const scheduleRequest: ScheduleRequest = await request.json()
        const response = await api.put(`/staff/schedules/${id}`, scheduleRequest)
        const schedule: Schedule = response.data.data

        return NextResponse.json({
            status: 1073741824,
            message: "Schedule updated successfully",
            data: schedule,
        })
    }
    catch (error: unknown) {
        const axiosError = error as AxiosError<any>
        console.error("Error updating schedule:", axiosError)
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
                message: "Failed to update schedule",
                data: null,
            },
            { status: 500 },
        )
    }
}

// DELETE schedule by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = Number.parseInt(params.id)
        await api.delete(`/staff/schedules/${id}`)

        return NextResponse.json({
            status: 1073741824,
            message: "Schedule deleted successfully",
            data: null,
        })
    }
    catch (error: unknown) {
        const axiosError = error as AxiosError<any>
        console.error("Error deleting schedule:", axiosError)
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
                message: "Failed to delete schedule",
                data: null,
            },
            { status: 500 },
        )
    }
}
