import { type NextRequest, NextResponse } from "next/server"
import type { Patient } from "@/types/patient"
import api from "@/lib/axios"
import { AxiosError } from "axios"

// PATCH reactivate patient
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    
    // Forward the authorization header from the incoming request
    const authHeader = request.headers.get('authorization');
    const headers: Record<string, string> = {};
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const res = await api.patch(`/patient/${id}/reactivate`, {}, { headers })

    return NextResponse.json(
      {
        status: 1073741824,
        message: "Patient reactivated successfully",
        data: res.data.data,
      },
      { status: 200 },
    )
  } catch (error: unknown) {
    const axiosError = error as AxiosError<any>;
    console.error("Error reactivating patient:", axiosError);
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
        message: "Failed to reactivate patient",
        data: null,
      },
      { status: 500 },
    )
  }
} 