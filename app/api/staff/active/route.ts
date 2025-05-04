import { NextResponse } from "next/server"
import type { Staff } from "@/types/staff"
import api from "@/lib/axios"
import { AxiosError } from "axios"

// GET active staff
export async function GET() {
  try {
    const response = await api.get('/staff/active')
    const staff: Staff[] = response.data.data

    return NextResponse.json({
      status: 1073741824,
      message: "Active staff members retrieved successfully",
      data: staff,
    })
  }
  catch (error: unknown) {
    const axiosError = error as AxiosError<any>;
    console.error("Error retrieving active staff members:", axiosError);
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
        message: "Failed to retrieve active staff members",
        data: null,
      },
      { status: 500 },
    )
  }
}
