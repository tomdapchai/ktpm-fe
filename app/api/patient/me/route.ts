import { type NextRequest, NextResponse } from "next/server"
import type { Patient } from "@/types/patient"
import api from "@/lib/axios"
import { AxiosError } from "axios"

// GET current patient
export async function GET(request: NextRequest) {
  try {
    // Forward the authorization header from the incoming request
    const authHeader = request.headers.get('authorization');
    const headers: Record<string, string> = {};
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    const response = await api.get('/patient/me', { headers })
    const patient: Patient = response.data.data

    return NextResponse.json({
      status: 1073741824,
      message: "Current patient retrieved successfully",
      data: patient,
    })
  }
  catch (error: unknown) {
    const axiosError = error as AxiosError<any>;
    console.error("Error retrieving current patient:", axiosError);
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
        message: "Failed to retrieve current patient",
        data: null,
      },
      { status: 500 },
    )
  }
} 