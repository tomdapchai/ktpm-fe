import { NextResponse } from "next/server"
import type { Schedule } from "@/types/schedule"
import api from "@/lib/axios"
import { AxiosError } from "axios"
// GET active schedules
export async function GET() {
    try {
        const response = await api.get("/staff/schedules/active")
        const schedules: Schedule[] = response.data.data

        return NextResponse.json({
            status: 1073741824,
            message: "Active schedules retrieved successfully",
            data: schedules,
        })
    } catch (error: unknown) {
        const axiosError = error as AxiosError<any>
        console.error("Error retrieving active schedules:", axiosError)
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
                message: "Failed to retrieve active schedules",
                data: null,
            },
            { status: 500 },
        )
    }
}
