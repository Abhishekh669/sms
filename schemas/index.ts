import * as z from "zod";


export const formSchema = z.object({
  email: z.string().trim().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().trim().min(1, {
    message: "Password must be at 1 characters long.",
  }),
})


export const register_schema = z.object({
  email: z.string().trim().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().trim().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
});


export const todoSchema = z.object({
  title: z
    .string().trim()
    .min(2, { message: "Minimum 2 characters are required" })
    .max(15, { message: "Maximum of 15 characters is allowed" }),
  description: z
    .string().trim()
    .min(2, { message: "Minimum 2 characters are required" })
    .max(40, { message: "Maximum of 40 characters is allowed" }),
  tag: z.enum(["HIGH", "MEDIUM", "LOW"], { required_error: "Priority is required" }),
  state: z.enum([ "PENDING", "ONGOING", "DONE"]),
});



export const editSchema= z.object({
  title: z
    .string().trim()
    .min(2, { message: "Minimum 2 characters are required" })
    .max(15, { message: "Maximum of 15 characters is allowed" }),
  description: z
    .string().trim()
    .min(2, { message: "Minimum 2 characters are required" })
    .max(40, { message: "Maximum of 40 characters is allowed" }),
  tag: z.enum(["HIGH", "MEDIUM", "LOW"], { required_error: "Priority is required" }),
  state: z.enum([ "PENDING", "ONGOING", "DONE"]),
  
});

export enum TaskStatus {
    PENDING = "PENDING",
    ONGOING = "ONGOING",
    DONE = "DONE"
}


export enum TaskTag {
  HIGH ="HIGH",
  MEDIUM="MEDIUM",
  LOW="LOW"
}


export enum Role{
  TEACHER="teacher",
  STUDENT="student",
  GUEST="guest",
}




export const onboardingSchema = z.object({
  image: z
    .string()
    .url("Please enter a valid URL for the image")
    .optional(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than or equal to 100 characters"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .max(15, "Phone number must be less than or equal to 15 characters")
    .regex(/^\+?[1-9]\d{1,14}$/, "Phone number is not valid"), // Regex for international phone number format
  guardianName: z
    .string()
    .min(1, "Guardian name is required")
    .max(100, "Guardian name must be less than or equal to 100 characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(100, "Email must be less than or equal to 100 characters"),
  address: z
    .string()
    .min(1, "Address is required")
    .max(255, "Address must be less than or equal to 255 characters"),
  qualification: z
    .string()
    .min(1, "Qualification is required")
    .max(100, "Qualification must be less than or equal to 100 characters"),
  role : z.enum(['teacher', 'student', "guest"]),
  class : z.string().optional(),
});