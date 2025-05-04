import * as z from "zod";

export const staffFormSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phoneNumber: z.string().min(10, { message: "Please enter a valid phone number" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  dateOfBirth: z.date({ required_error: "Date of birth is required" }),
  gender: z.string().min(1, { message: "Gender is required" }),
  staffType: z.enum(["DOCTOR", "NURSE", "ADMIN"], {
    required_error: "Staff type is required",
  }),
  department: z.string().min(1, { message: "Department is required" }),
  position: z.string().min(1, { message: "Position is required" }),
  qualifications: z.array(z.string()).min(1, { message: "At least one qualification is required" }),
  specializations: z.array(z.string()),
  joiningDate: z.date({ required_error: "Joining date is required" }),
  active: z.boolean().default(true),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).optional(),
  subject: z.string().optional(),
})

export const patientFormSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phoneNumber: z.string().min(10, { message: "Please enter a valid phone number" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  dateOfBirth: z.date({ required_error: "Date of birth is required" }),
  gender: z.string().min(1, { message: "Gender is required" }),
  bloodType: z.string().min(1, { message: "Blood type is required" }),
  medicalHistory: z.array(z.string()),
  allergies: z.array(z.string()),
  emergencyContactName: z.string().min(2, { message: "Emergency contact name is required" }),
  emergencyContactPhone: z.string().min(10, { message: "Please enter a valid emergency contact phone number" }),
  registrationDate: z.date({ required_error: "Registration date is required" }),
  active: z.boolean().default(true),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).optional(),
  subject: z.string().optional(),
})