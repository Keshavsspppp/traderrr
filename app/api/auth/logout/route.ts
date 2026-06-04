import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/cookies";
import { apiHandler } from "@/lib/errors";

export const POST = apiHandler(async () => {
  const response = NextResponse.json({ success: true });
  return clearAuthCookie(response);
});
