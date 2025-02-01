"use server"
import { Role } from "@/schemas";
import { authorize_student, create_student } from "../students/students";
import { authorize_teacher, create_teacher } from "../teachers/teachers";
import { get_current_user } from "../users/users";
import {prisma} from "@/lib/prisma";
import { error } from "console";


export interface OnboardingType {
    name : string,
    image ?: File | null,
    phoneNumber : string,
    guardianName : string,
    email ?: string,
    address : string,
    qualification : string,
    class ?: string,
    role : "teacher" | "student" | "guest",
    
}

export const onboard_user= async(values : OnboardingType) =>{
    try {
        const current_user = await get_current_user();
        if(!current_user?.id || !current_user?.email){
          throw new Error("Unauthorized");
        }
        
        const new_data = {...values, userId : current_user?.id};
        if(new_data.role === Role.STUDENT){
            const res = await create_student(new_data);
            if(res.error){
                return {error : "Failed to authorze teacher"}
            }else if(res.message && res.result){
                return {
                    message : res.message,
                    result  :res.result
                }
            }else{
                throw new Error("Something went wrong")
            }
        }else if(new_data.role == Role.TEACHER){
            const res = await create_teacher(new_data);
            if(res.error){
                return {error : "Failed to authorze teacher"}
            }else if(res.message && res.result){
                return {
                    message : res.message,
                    result  :res.result
                }
            }else{
                throw new Error("Something went wrong")
            }
        }else{
            return {error : "Something went wrong"}
        }
        
    } catch (error) {
        return {error : error || "Failed to do onboarding" }
        
    }
}



export const authorize_user = async({id, role} : {id : string, role : string}) =>{
    try {
        const current_user = await get_current_user();
        if(!current_user?.id || !current_user?.email || !current_user?.isOnBoarded){
          throw new Error("Unauthorized");
        }
        if(role === "Student"){
            const res = await authorize_student(id);
            if(res.error){
                return {error : "Failed to authorze teacher"}
            }else if(res.message && res.result){
                return {
                    message : res.message,
                    result  :res.result
                }
            }else{
                throw new Error("Something went wrong")
            }
        }else if(role === "Teacher"){
            const res = await authorize_teacher(id);
            if(res.error){
                return {error : "Failed to authorze teacher"}
            }else if(res.message && res.result){
                return {
                    message : res.message,
                    result  :res.result
                }
            }else{
                throw new Error("Something went wrong")
            }

        }else{
            return {error : "No such role exists"}
        }

    } catch (error) {
        return {error : error || "Failed to do authorization"}
    }
}


export const reject_user = async(id : string) =>{
    try {
        const current_user = await get_current_user();
        if(!current_user?.id || !current_user?.email || !current_user?.isOnBoarded){
            throw new Error("Unauthorized");
          }

        const find_user = await prisma.user.findFirst({
            where : {id}
        });
        if(!find_user){
            return {error : "No user found"}
        }

        const delete_user = await prisma.user.delete({where : {id}})
        if(!delete_user){
            return {error  :"Failed to reject the user"}
        }

        return {
            message : "successfully rejected user",
            result : JSON.stringify(delete_user)
        }

    } catch (error) {
        return {error : error || "Failed to reject the user"}
        
    }
}