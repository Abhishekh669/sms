"use server"

import { auth } from "@/auth"
import {prisma} from "@/lib/prisma"

export const get_logged_user = async() =>{
    const session = await auth();
    if(!session?.user) return null;
    return session;
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