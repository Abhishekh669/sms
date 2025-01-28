"use server"

import { auth } from "@/auth"
import {prisma} from "@/lib/prisma"

export const get_logged_user = async() =>{
    const session = await auth();
    if(!session?.user) return null;
    return session;
}


export const get_user_by_id = async(userId : string) =>{
  try {
    const current_user = await get_current_user();
    if(!current_user?.id || !current_user?.email){
      throw new Error("Unauthorized");
    }
    const user = await prisma.user.findUnique({
      where : { id : userId}
    });
    if(!user){
      return {
        error : "User not found"
      }
    }
    return {
      message : "Found user",
      user : JSON.stringify(user)
    }
  } catch (error) {
    return {
      error : "Failed to get user"
    }
  }
}

export const get_current_user =async() =>{
    const session = await auth();
    if(!session?.user) return null;
    const user = await prisma.user.findUnique({
        where : { id : session?.user?.id}
    });
    if(!user){
        return null;
    }
    return user;
}




