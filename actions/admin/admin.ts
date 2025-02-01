"use server";

import { hash } from "bcryptjs";
import { get_current_user } from "../users/users";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

interface create_admin_props {
  email: string;
  password: string;
}
export const create_admin = async (values: create_admin_props) => {
  if (values.password.length < 6)
    return { error: "Password must be of 6 character" };
  try {
    const current_user = await get_current_user();
    if (
      !current_user?.id ||
      !current_user?.email ||
      !current_user?.isAdmin ||
      !current_user?.allowCreate
    ) {
      throw new Error("Unauthorized");
    }
    const find_admin = await prisma.admin.findFirst({
      where: { userId: current_user?.id, email: values.email },
    });
    if (find_admin) {
      return {
        error: "Already exists",
      };
    }
    const no_of_admin = await prisma.admin.findMany();

    if (no_of_admin.length > 2) {
      return {
        error: "Max no. of admin",
      };
    }
    const hashedPassword = await hash(values.password, 10);
    const new_admin = await prisma.admin.create({
      data: {
        email: values.email,
        password: hashedPassword,
        userId: current_user?.id,
      },
    });
    if (!new_admin) {
      return {
        error: "Failed to create",
      };
    }
    return {
      message: "created new admin",
      admin: JSON.stringify(new_admin),
    };
  } catch (error) {
    return { error: "Failed to create" };
  }
};

export const get_all_admin = async () => {
  try {
    const current_user = await get_current_user();
    if (!current_user?.id || !current_user?.email || !current_user?.isAdmin) {
      return { error: "Sorry guys" };
    }

    const all_admin = await prisma.admin.findMany();
    if (all_admin.length == 0) {
      return {
        message: "No user",
        all_admin: all_admin.length,
      };
    }
    return {
      message: "got somethings",
      all_admin: all_admin.length,
    };
  } catch (error) {
    return { error: "Something went wrong" };
  }
};

export const fetch_token = async () => {
  try {
    const current_user = await get_current_user();
    if (!current_user?.id || !current_user?.email || !current_user?.isAdmin) {
      return { error: "Failed to get token" };
    }
    const cookieStore = cookies();
    const token = (await cookieStore).get("auth-token")?.value || "";
    if (!token) {
      return { error: "failed to get token" };
    }
    let admin_data: any = jwt.verify(
      token,
      process.env.SECRET_COOKIE_PASSWORD!
    );

    if (!admin_data) {
      return { error: "Failed to get token" };
    }
    const check_admin = await prisma.admin.findFirst({
      where: {
        id: admin_data.id as string,
        userId: current_user?.id as string,
      },
    });
    if (!check_admin) {
      return { error: "Failed to get token" };
    }
    return {
      message: "successfull_admin_token",
      data: { id: check_admin?.id },
    };
  } catch (error) {
    return { error: "Failed to get token" };
  }
};


export const fetch_unverified_user = async()=>{
  try {
    const current_user = await get_current_user();
    if(!current_user?.id || !current_user?.email ||  !current_user?.isAdmin){
      return {
        error : "Not authorized"
      }
    };

    const find_students = await prisma.student.findMany({
      where : {
        isOnBoarded : true,
        isVerified : false,
      }
    }) || [];

    const find_teachers = await prisma.teacher.findMany({
      where : {
        isOnBoarded : true,
        isVerified : false
      }
    })|| [];

    const results = [...find_students, ...find_teachers];
    const final_result = results?.filter((result)=> result.userId !== current_user?.id)
    return {
      message : "Got all the unverified users",
      result : JSON.stringify(final_result),
    }
    
  } catch (error) {
    return {error : "Failed to fetch unverified user"}
    
  }
}
