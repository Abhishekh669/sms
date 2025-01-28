import { get_current_user } from "@/actions/users/users";
import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma"
import { compare } from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken"

export interface decodeType extends JwtPayload {
    id: string;
    email: string;
    userId : string;
  }
export async function POST(request :NextRequest){
    try {
        const current_user = await get_current_user();
        if(!current_user?.id || !current_user?.email || !current_user?.isAdmin){
            return NextResponse.json({error : "Unauthorized"})
        }
        const req_body  = await request.json();
        const {email, password} = req_body;

          const find_admin = await prisma.admin.findFirst({
                where : {userId : current_user?.id,email : email}
            });
        
            if(!find_admin || !find_admin?.email){
                return NextResponse.json({error : "Failed to login"})

            }

            console.log("this is found admin okie ",find_admin);
        
            const isMatch = await compare(
                password,
                find_admin.password
            );
            console.log("passowrd matched : ?",isMatch)
            if(!isMatch){
                return NextResponse.json({error : "Failed to login"})
            }

            const tokenData : decodeType = {
                id : find_admin?.id as string,
                userId : current_user?.id as string,
                email : email as string
            };

            const token = jwt.sign(tokenData, process.env.SECRET_COOKIE_PASSWORD!,{expiresIn : '7d'})
            const response = NextResponse.json({
                message : "logged in success",
                success : true,
            });
            response.cookies.set("auth-token", token,{
                httpOnly : true
            })
            return response;
    } catch (error) {
        return NextResponse.json({error : "Failed to login"})
    }
}