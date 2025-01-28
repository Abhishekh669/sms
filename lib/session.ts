import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

  


const key = new TextEncoder().encode(process.env.SECRET_COOKIE_PASSWORD)



export async function encrypt(payload: any) {
  // Ensure that payload.expires is a Date object
  const expirationDate = new Date(payload.expires); // Create a Date object

  // If expires is not a valid date, log and throw an error
  if (isNaN(expirationDate.getTime())) {
    throw new Error("Invalid expiration date");
  }

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expirationDate)  // Directly pass the Date object
    .sign(key);
}
export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function getSession() {
  const session = (await cookies()).get("authjs_session")?.value;
  if (!session) return null;
  return await decrypt(session);
}


export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("authjs_session")?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 10 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}


export async function logout() {
  // Destroy the session
  (await cookies()).set("authjs_session", "", { expires: new Date(0) });
}