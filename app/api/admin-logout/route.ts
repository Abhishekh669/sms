import { NextRequest, NextResponse } from "next/server";


export async function GET(request : NextRequest){
    try {
        const response = NextResponse.json({
            message : "logout successfully",
            success : true
        });
        response.cookies.set("auth-token", "",{
            httpOnly : true,
            expires : new Date(0)
        })
        return response;
    } catch (error) {
        return NextResponse.json({error : "Failed to logou"})
        
    }
}