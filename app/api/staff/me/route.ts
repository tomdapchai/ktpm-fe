import { NextResponse } from "next/server"
import type { Staff } from "@/types/staff"
import api from "@/lib/axios"
import { AxiosError } from "axios";

// In a real application, this would use authentication to get the current user
// For this demo, we'll just return a mock staff member

export async function GET() {
  // Mock current user - in a real app, this would be determined from the session
  try {
    const response = await api.get('/staff/me')
    const staff: Staff = response.data.data

    return NextResponse.json({
      status: 1073741824,
      message: "Current staff member retrieved successfully",
      data: staff,
    })

  }
  catch (error: unknown) {
    const axiosError = error as AxiosError<any>;
    console.error("Error retrieving current staff member:", axiosError);
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
        message: "Failed to retrieve current staff member",
        data: null,
      },
      { status: 500 },
    )
  }

  
}
