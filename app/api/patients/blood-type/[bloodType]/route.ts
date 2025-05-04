import { type NextRequest, NextResponse } from "next/server"
import type { Patient } from "@/types/patient"
import api from "@/lib/axios"
import { AxiosError } from "axios"

// GET patients by blood type
export async function GET(request: NextRequest, { params }: { params: { bloodType: string } }) {
  const { bloodType } = params
  try {
    // Forward the authorization header from the incoming request
    const authHeader = request.headers.get('authorization');
    const headers: Record<string, string> = {};
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    const response = await api.get(`/patient/blood-type/${bloodType}`, { headers })
    const patients: Patient[] = response.data.data

    return NextResponse.json({
      status: 1073741824,
      message: "Patients retrieved successfully",
      data: patients,
    })
  }
  catch (error: unknown) {
    const axiosError = error as AxiosError<any>;
    console.error("Error retrieving patients by blood type:", axiosError);
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
        message: "Failed to retrieve patients by blood type",
        data: null,
      },
      { status: 500 },
    )
  }
} 