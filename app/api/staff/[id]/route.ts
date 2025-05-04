import { type NextRequest, NextResponse } from "next/server"
import type { Staff, StaffRequest } from "@/types/staff"
import api from "@/lib/axios"
import { Axios, AxiosError } from "axios"
// This is a mock implementation - in a real app, this would interact with a database
// For simplicity, we're using the same mock data from the main staff route
// In a real app, you would import a data service or use a database client


// GET staff by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

  const res = await api.get(`/staff/${id}`)

  return NextResponse.json({
    status: 1073741824,
    message: "Staff retrieved successfully",
    data: res.data.data,
  })
  } catch (error: unknown) {
    const axiosError = error as AxiosError<any>;
    console.error("Error retrieving staff:", axiosError);
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
        message: "Failed to retrieve staff",
        data: null,
      },
      { status: 500 },
    )
  }
}

// PUT (update) staff by ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const staffRequest: StaffRequest = await request.json()

    const response = await api.put(`/staff/${id}`, staffRequest)

    return NextResponse.json({
      status: 1073741824,
      message: "Staff updated successfully",
      data: response.data.data,
  })} catch (error: unknown) {
    const axiosError = error as AxiosError<any>;
    console.error("Error updating staff:", axiosError)
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
        message: "Failed to retrieve staff",
        data: null,
      },
      { status: 500 },
    )
  }
}

// DELETE staff by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    
    await api.delete(`/staff/${id}`)

    return NextResponse.json({
      status: 1073741824,
  })} catch (error: unknown) {
    const axiosError = error as AxiosError<any>;
    console.error("Error deleting staff:", axiosError)
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
        message: "Failed to retrieve staff",
        data: null,
      },
      { status: 500 },
    )
  }
}
