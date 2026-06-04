import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireUser } from "@/lib/api-auth";
import { apiHandler } from "@/lib/errors";
import { getDashboardData } from "@/services/dashboard.service";

export const GET = apiHandler(async () => {
  await connectDB();
  const user = await requireUser();
  const data = await getDashboardData(user._id.toString());
  return NextResponse.json(data);
});
