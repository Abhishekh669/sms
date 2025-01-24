"use server"
import { signIn, signOut } from "@/auth"
import { revalidatePath } from "next/cache"

export const do_social_login = async (action : string) =>{
    await signIn(action,{
      redirectTo : "/sms/dashboard"
    })
 }
 


 export const logout = async () =>{
  await signOut({
     redirectTo : "/"
  });
  revalidatePath("/")
}