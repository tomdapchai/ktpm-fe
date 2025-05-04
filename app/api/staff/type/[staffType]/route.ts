import { type NextRequest, NextResponse } from "next/server"
import type { Staff, StaffType } from "@/types/staff"
import api from "@/lib/axios"
import { AxiosError } from "axios"

// GET staff by type
export async function GET(request: NextRequest, { params }: { params: { staffType: string } }) {
  const { staffType } = params
  try {
    const response = await api.get(`/staff/type/${staffType}`)
    const staff: Staff[] = response.data.data

    return NextResponse.json({
      status: 1073741824,
      message: "Staff members retrieved successfully",
      data: staff,
    })
  }
  catch (error: unknown) {
    const axiosError = error as AxiosError<any>;
    console.error("Error retrieving staff members by type:", axiosError);
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
        message: "Failed to retrieve staff members by type",
        data: null,
      },
      { status: 500 },
    )
  }
}
