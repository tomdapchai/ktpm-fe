import { type NextRequest, NextResponse } from "next/server"
import type { Workload, WorkloadRequest } from "@/types/workload"
import api from "@/lib/axios"
import { AxiosError } from "axios"


// GET workload by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = Number.parseInt(params.id)
        const response = await api.get(`/staff/workloads/${id}`)
        const workload: Workload = response.data.data
    
        return NextResponse.json({
        status: 1073741824,
        message: "Workload retrieved successfully",
        data: workload,
        })
    } catch (error: unknown) {
        const axiosError = error as AxiosError<any>
        console.error("Error retrieving workload:", axiosError)
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
            message: "Failed to retrieve workload",
            data: null,
        },
        { status: 500 },
        )
    }
}

// PUT (update) workload by ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = Number.parseInt(params.id)
        const workloadRequest: WorkloadRequest = await request.json()
        const response = await api.put(`/staff/workloads/${id}`, workloadRequest)
        const workload: Workload = response.data.data
    
        return NextResponse.json({
        status: 1073741824,
        message: "Workload updated successfully",
        data: workload,
        })
    } catch (error: unknown) {
        const axiosError = error as AxiosError<any>
        console.error("Error updating workload:", axiosError)
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
            message: "Failed to update workload",
            data: null,
        },
        { status: 500 },
        )
    }
    
}

// DELETE workload by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = Number.parseInt(params.id)
        const response = await api.delete(`/staff/workloads/${id}`)
    
        return NextResponse.json({
        status: 1073741824,
        message: "Workload deleted successfully",
        data: null,
        })
    } catch (error: unknown) {
        const axiosError = error as AxiosError<any>
        console.error("Error deleting workload:", axiosError)
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
            message: "Failed to delete workload",
            data: null,
        },
        { status: 500 },
        )
    }
}
