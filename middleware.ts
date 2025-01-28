import { NextRequest, NextResponse } from "next/server"
import { auth } from "./auth";
import { adminRoute, authRoute, protectedRoute, publicRoute } from "./lib/routes";


export async function middleware(request : NextRequest){
    const session = await auth();
    const {url, nextUrl} = request;
    const isAuthenticated = !!session?.user;

    const isAuthRoute = authRoute.includes(nextUrl.pathname);

    const isProtectedRoute = protectedRoute.includes(nextUrl.pathname);

    const isAdminPath = adminRoute.includes(nextUrl.pathname)

    
    const isPublicRoute = publicRoute.includes(nextUrl.pathname);

    if(isAuthRoute){
        if(isAuthenticated){
            return Response.redirect(new URL("/sms/dashboard", nextUrl));
        }
        return null;
    }

    if(!isAuthenticated && !isPublicRoute){
        return Response.redirect(new URL("/auth/login", nextUrl));
    }


    
    console.log(" public route : ",isPublicRoute)
    return null;
}

export const config = {
    matcher : ["/sms/:path*","/auth/:path*"]
} 