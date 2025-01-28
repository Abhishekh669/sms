import { NextRequest, NextResponse } from "next/server"
import { get_data_from_token } from "@/lib/data"
import {prisma} from "@/lib/prisma"
import { get_current_user } from "@/actions/users/users";


export async function GET(request : NextRequest){
       try {
             const current_user = await get_current_user();
            if(!current_user?.id || !current_user?.email || !current_user?.isAdmin){
                        return NextResponse.json({error : "Unauthorized"})
                    }
            let admin_data : any = await get_data_from_token(request);
            if(!admin_data){
                return NextResponse.json({error : "Failed to get data"})
            }
            const check_admin = await prisma.admin.findFirst({
                where : {
                    id : admin_data.id as string,
                    userId : current_user?.id as string
                }
            })
            if(!check_admin){
                return NextResponse.json({error : "Failed"})
            }
            return NextResponse.json({message : "successfull_admin_token", success : true})

       } catch (error) {
        
        return NextResponse.json({error : "Failed to get token"});
       }

}