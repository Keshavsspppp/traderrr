import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireUser } from "@/lib/api-auth";
import { apiHandler } from "@/lib/errors";
import { resetUserPortfolio } from "@/services/portfolio-reset.service";
import { toSafeUser } from "@/lib/session";

export const POST = apiHandler(async () => {
  await connectDB();
  const user = await requireUser();
  await resetUserPortfolio(user);
  return NextResponse.json({
    message: "Portfolio reset to ₹10L virtual cash",
    user: toSafeUser(user),
  });
});
