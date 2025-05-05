/* eslint-disable @typescript-eslint/no-unused-vars */
import { type NextRequest, NextResponse } from "next/server"
import type { Patient, PatientRequest } from "@/types/patient"
import api from "@/lib/axios"
import { AxiosError } from "axios";

// GET all patients
export async function GET(request: NextRequest) {
  try {
    // Forward the authorization header from the incoming request
    const authHeader = request.headers.get('authorization');
    const headers: Record<string, string> = {};
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    const response = await api.get('/patient', { headers });
    
    return NextResponse.json({
      status: 1073741824,
      message: "Patients retrieved successfully",
      data: response.data.data,
    })
  } catch (error: unknown) {
    const axiosError = error as AxiosError<any>;
    console.error("Error retrieving patients:", error);
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
        message: "Failed to retrieve patients",
        data: null,
      },
      { status: 500 },
    )
  }
}

// POST new patient
export async function POST(request: NextRequest) {
  try {
    const patientRequest: PatientRequest = await request.json();
    console.log("Patient request received:", patientRequest);
    
    // Forward the authorization header from the incoming request
    const authHeader = request.headers.get('authorization');
    const headers: Record<string, string> = {};
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
      console.log("Authorization header found and forwarded");
    } else {
      console.log("No authorization header found in the request");
    }
    
    console.log("Making API call to:", '/patient');
    const response = await api.post('/patient', patientRequest, { headers });
    console.log("API response:", response.data);
    
    return NextResponse.json(
      {
        status: 1073741824,
        message: "Patient created successfully",
        data: response.data.data,
      },
      { status: 201 },
    )
  } catch (error: unknown) {
    const axiosError = error as AxiosError<any>;
    console.error("Error creating patient:", error);
    
    if (axiosError.response) {
      console.error("API response error data:", axiosError.response.data);
      console.error("API response error status:", axiosError.response.status);
      console.error("API response error headers:", axiosError.response.headers);
      
      if (axiosError.response.status === 401) {
        return NextResponse.json(
          {
            status: 0,
            message: "Unauthorized",
            data: null,
          },
          { status: 401 },
        )
      }
      
      // Return more specific error message if available
      const errorMessage = axiosError.response.data?.message || "Failed to create patient";
      return NextResponse.json(
        {
          status: 0,
          message: errorMessage,
          data: null,
        },
        { status: axiosError.response.status },
      )
    }
    
    if (axiosError.request) {
      console.error("No response received from API:", axiosError.request);
    }
    
    return NextResponse.json(
      {
        status: 0,
        message: "Failed to create patient",
        data: null,
      },
      { status: 500 },
    )
  }
} 