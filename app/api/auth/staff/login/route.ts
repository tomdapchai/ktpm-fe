import { type NextRequest, NextResponse } from "next/server"
import api from "@/lib/axios"
import { AxiosError } from "axios"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const response = await api.post('/auth/staff/login', {
      subject: body.subject,
      password: body.password
    });

    return NextResponse.json(response.data)
  } catch (error: unknown) {
    const axiosError = error as AxiosError<any>;
    console.error("Staff login error:", error);
    
    if (axiosError.response) {
      return NextResponse.json(
        {
          status: axiosError.response.status,
          message: "Login failed",
          data: null,
        },
        { status: axiosError.response.status }
      )
    }
    
    return NextResponse.json(
      {
        status: 500,
        message: "An unexpected error occurred",
        data: null,
      },
      { status: 500 }
    )
  }
}
