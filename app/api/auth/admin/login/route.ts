import { type NextRequest, NextResponse } from "next/server"
import api from "@/lib/axios"
import { AxiosError } from "axios"

export async function POST(request: NextRequest) {
  console.log("Admin login API route called");
  
  try {
    const body = await request.json()
    console.log("Request body:", { subject: body.subject, password: "***" });
    
    const response = await api.post('/auth/admin/login', {
      subject: body.subject,
      password: body.password
    });

    console.log("Admin login API response:", {
      status: response.status,
      hasData: !!response.data
    });

    return NextResponse.json(response.data)
  } catch (error: unknown) {
    const axiosError = error as AxiosError<any>;
    console.error("Admin login API error:", error);
    
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
