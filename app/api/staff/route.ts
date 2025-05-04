/* eslint-disable @typescript-eslint/no-unused-vars */
import { type NextRequest, NextResponse } from "next/server"
import type { Staff, StaffRequest } from "@/types/staff"
import api from "@/lib/axios"
import { AxiosError } from "axios";

// GET all staff
export async function GET(request: NextRequest) {
  try {
    // Forward the authorization header from the incoming request
    const authHeader = request.headers.get('authorization');
    const headers: Record<string, string> = {};
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    const response = await api.get('/staff', { headers });
    
    return NextResponse.json({
      status: 1073741824,
      message: "Staff retrieved successfully",
      data: response.data.data,
    })
  } catch (error: unknown) {
    const axiosError = error as AxiosError<any>;
    console.error("Error retrieving staff:", error);
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
        message: "Failed to retrieve staff",
        data: null,
      },
      { status: 500 },
    )
  }
}

// POST new staff
export async function POST(request: NextRequest) {
  try {
    const staffRequest: StaffRequest = await request.json()
    const response = await api.post('/staff', staffRequest);

    return NextResponse.json(
      {
        status: 1073741824,
        message: "Staff created successfully",
        data: response.data,
      },
      { status: 201 },
    )
  } catch (error: unknown) {
    const axiosError = error as AxiosError<any>;
    console.error("Error creating staff:", error)
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
        message: "Failed to retrieve staff",
        data: null,
      },
      { status: 500 },
    )
  }
}
