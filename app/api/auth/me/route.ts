import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { apiHandler, AppError } from "@/lib/errors";

export const GET = apiHandler(async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }
  return NextResponse.json({ user });
});
