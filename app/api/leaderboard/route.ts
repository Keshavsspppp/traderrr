import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireUser } from "@/lib/api-auth";
import { apiHandler } from "@/lib/errors";
import { getLeaderboard } from "@/services/leaderboard.service";

export const GET = apiHandler(async () => {
  await connectDB();
  const user = await requireUser();
  const investors = await getLeaderboard(user._id.toString());
  return NextResponse.json({ investors });
});
