import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const protectedPaths = [
  "/dashboard",
  "/market",
  "/portfolio",
  "/leaderboard",
  "/contests",
  "/profile",
];

const authPaths = ["/login", "/register"];

const JWT_SECRET = process.env.JWT_SECRET;
const secret = JWT_SECRET || "dev-only-secret-change-me";
const jwtKey = new TextEncoder().encode(secret);

async function isValidToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, jwtKey);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isProtected = protectedPaths.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  const isAuthPage = authPaths.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  const validToken = token ? await isValidToken(token) : false;

  if (isProtected && !validToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && validToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/market/:path*",
    "/portfolio/:path*",
    "/leaderboard/:path*",
    "/contests/:path*",
    "/profile/:path*",
    "/login",
    "/register",
  ],
};
