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


