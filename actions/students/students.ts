"use server";

import { uploadFile } from "@/lib/upload";
import { prisma } from "@/lib/prisma";
import { get_current_user } from "../users/users";
import { Currency } from "lucide-react";

export interface StudentType {
  name: string;
  image?: File | null;
  phoneNumber: string;
  guardianName: string;
  email?: string;
  address: string;
  qualification: string;
  class?: string;
  role: "teacher" | "student" | "guest";
  userId: string;
}

export const create_student = async (values: StudentType) => {
  try {
    let image_url = "";

    if (values.image) {
      const generate_link = await uploadFile(values.image);
      if (!generate_link?.url) {
        console.log("failed to upload the image");
        return { error: "failed to upload the image" };
      }
      image_url = generate_link?.url;
    }

    const exist_students = await prisma.student.findFirst({
      where: { userId: values.userId },
    });
    if (exist_students) {
      return { error: "Aleady existed students" };
    }
    const new_student = await prisma.student.create({
      data: {
        name: values.name,
        phoneNumber: values.phoneNumber,
        guardianName: values.guardianName,
        email: values.email,
        image: values?.image?.name || "",
        address: values.address,
        image_url: image_url,
        class: values?.class || "",
        userId: values?.userId,
        qualification: values?.qualification,
        isOnBoarded: true,
        role: "Student",
      },
    });

    if (!new_student) {
      return { error: "failed to create the students" };
    }

    const update_user = await prisma.user.update({
      where: { id: values.userId },
      data: {
        isOnBoarded: true,
        role: "Student",
      },
    });

    if (!update_user) {
      return { error: "Failed to onboard the user" };
    }

    return {
      message: "student create successfully",
      result: JSON.stringify(new_student),
    };
  } catch (error) {
    return { error: "Failed to create student" };
  }
};

export const authorize_student = async (id : string) => {
  try {
    const check_students = await prisma.student.findUnique({
      where: { id },
    });
    if (!check_students) {
      return { error: "No studnets occured" };
    }
    const verify_student = await prisma.student.update({
      where: {
        id,
      },
      data: {
        isVerified: true,
      },
    });
    if (!verify_student) {
      return { error: "Failed to verify the students" };
    }
    const verify_user = await prisma.user.update({
      where: { id: verify_student.userId },
      data: {
        isVerified: true,
      },
    });
    if (!verify_user) {
      return { error: "Failed to verify the user" };
    }
    return {
      message: `Successfully verified the student ${verify_student.name}`,
      result: JSON.stringify(verify_student),
    };
  } catch (error) {
    return { error: "Failed to authorzie the student" };
  }
};



export const get_student_by_id = async() =>{
  try {
    const current_user = await get_current_user();
    if(!current_user?.id || !current_user?.isOnBoarded ||!current_user?.isVerified){
      throw new Error("Unauthorized")
    }
    const find_student = await prisma.user.findUnique({

      where : {id : current_user?.id}

    });
    if(!find_student){
      return {error : "No student found"}
    }
    const student = await prisma.student.findFirst({
      where : {userId : current_user?.id }
    })
    return {
      message : "Successfully found student",
      result : JSON.stringify(student)
    }
  } catch (error) {
    console.log("Failed to get the error")
    
  }
}