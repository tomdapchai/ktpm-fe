import { type NextRequest, NextResponse } from "next/server"
import type { Workload, WorkloadRequest } from "@/types/workload"
import api from "@/lib/axios"
import { AxiosError } from "axios"

// GET all workloads
export async function GET() {
    try {
        const response = await api.get("/staff/workloads")
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

// POST new workload
export async function POST(request: NextRequest) {
    try {
        const workloadRequest: WorkloadRequest = await request.json()
        const response = await api.post("/staff/workloads", workloadRequest)
        const workload: Workload = response.data.data
    
        return NextResponse.json({
        status: 1073741824,
        message: "Workload created successfully",
        data: workload,
        })
    } catch (error: unknown) {
        const axiosError = error as AxiosError<any>
        console.error("Error creating workload:", axiosError)
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
            message: "Failed to create workload",
            data: null,
        },
        { status: 500 },
        )
    }
}
