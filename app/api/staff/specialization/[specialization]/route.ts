import { type NextRequest, NextResponse } from "next/server"
import type { Staff } from "@/types/staff"
import api from "@/lib/axios"
import { AxiosError } from "axios"

// GET staff by specialization
export async function GET(request: NextRequest, { params }: { params: { specialization: string } }) {
  const { specialization } = params
  try {
    const response = await api.get(`/staff/specialization/${specialization}`)
    const staff: Staff[] = response.data.data

    return NextResponse.json({
      status: 1073741824,
      message: "Staff members retrieved successfully",
      data: staff,
    })
  }
  catch (error: unknown) {
    const axiosError = error as AxiosError<any>;
    console.error("Error retrieving staff members by specialization:", axiosError);
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
        message: "Failed to retrieve staff members by specialization",
        data: null,
      },
      { status: 500 },
    )
  }
}
