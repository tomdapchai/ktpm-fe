import { type NextRequest, NextResponse } from "next/server"
import type { Patient, PatientRequest } from "@/types/patient"
import api from "@/lib/axios"
import { AxiosError } from "axios"

// GET patient by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    
    // Forward the authorization header from the incoming request
    const authHeader = request.headers.get('authorization');
    const headers: Record<string, string> = {};
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const res = await api.get(`/patient/${id}`, { headers })

    return NextResponse.json({
      status: 1073741824,
      message: "Patient retrieved successfully",
      data: res.data.data,
    })
  } catch (error: unknown) {
    const axiosError = error as AxiosError<any>;
    console.error("Error retrieving patient:", axiosError);
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
        message: "Failed to retrieve patient",
        data: null,
      },
      { status: 500 },
    )
  }
}

// PUT update patient
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number.parseInt(params.id)
    const patientRequest: PatientRequest = await request.json()
    
    // Forward the authorization header from the incoming request
    const authHeader = request.headers.get('authorization');
    const headers: Record<string, string> = {};
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const res = await api.put(`/patient/${id}`, patientRequest, { headers })

    return NextResponse.json(
      {
        status: 1073741824,
        message: "Patient updated successfully",
        data: res.data.data,
      },
      { status: 200 },
    )
  } catch (error: unknown) {
    const axiosError = error as AxiosError<any>;
    console.error("Error updating patient:", axiosError);
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
        message: "Failed to update patient",
        data: null,
      },
      { status: 500 },
    )
  }
}

// DELETE patient
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number.parseInt(params.id)
    
    // Forward the authorization header from the incoming request
    const authHeader = request.headers.get('authorization');
    const headers: Record<string, string> = {};
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    await api.delete(`/patient/${id}`, { headers })

    return NextResponse.json(
      {
        status: 1073741824,
        message: "Patient deleted successfully",
        data: null,
      },
      { status: 200 },
    )
  } catch (error: unknown) {
    const axiosError = error as AxiosError<any>;
    console.error("Error deleting patient:", axiosError);
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
        message: "Failed to delete patient",
        data: null,
      },
      { status: 500 },
    )
  }
} 