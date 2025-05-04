import { type NextRequest, NextResponse } from "next/server"
import type { Workload } from "@/types/workload"
import api from "@/lib/axios"
import { AxiosError } from "axios"

// GET workloads by date range
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    try {
        const response = await api.get(`/staff/workloads/date-range`, {
            params: { startDate, endDate },
        })
        const workloads: Workload[] = response.data.data

        return NextResponse.json({
            status: 1073741824,
            message: "Workloads retrieved successfully",
            data: workloads,
        })
    } catch (error: unknown) {
        const axiosError = error as AxiosError<any>
        console.error("Error retrieving workloads:", axiosError)
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
                message: "Failed to retrieve workloads",
                data: null,
            },
            { status: 500 },
        )
    }
  
}
