"use server"
import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken"
import { decodeType } from "@/app/api/admin-login/route";

export const get_data_from_token = async(request : NextRequest) =>{
    try {
        const token  = request.cookies.get("auth-token")?.value || "";
        const decoded_token: JwtPayload | string =  jwt.verify(token, process.env.SECRET_COOKIE_PASSWORD!);
        if(!decoded_token) return null;
        return decoded_token;
    } catch (error) {
        return null;
        
    }
}





