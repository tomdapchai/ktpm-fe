import { type NextRequest, NextResponse } from "next/server"
import type { Patient } from "@/types/patient"
import api from "@/lib/axios"
import { AxiosError } from "axios"

// GET patient by national ID
export async function GET(request: NextRequest, { params }: { params: { nationalId: string } }) {
  const { nationalId } = params
  try {
    // Forward the authorization header from the incoming request
    const authHeader = request.headers.get('authorization');
    const headers: Record<string, string> = {};
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    const response = await api.get(`/patient/national-id/${nationalId}`, { headers })
    const patient: Patient = response.data.data

    return NextResponse.json({
      status: 1073741824,
      message: "Patient retrieved successfully",
      data: patient,
    })
  }
  catch (error: unknown) {
    const axiosError = error as AxiosError<any>;
    console.error("Error retrieving patient by national ID:", axiosError);
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
        message: "Failed to retrieve patient by national ID",
        data: null,
      },
      { status: 500 },
    )
  }
} 