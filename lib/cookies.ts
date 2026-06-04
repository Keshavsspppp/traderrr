import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const TOKEN_COOKIE = "token";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set(TOKEN_COOKIE, token, cookieOptions);
  return response;
}

export async function setAuthCookieServer(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_COOKIE, token, cookieOptions);
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set(TOKEN_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  return response;
}

export async function clearAuthCookieServer() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE);
}

export async function getTokenFromCookies(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE)?.value;
}
