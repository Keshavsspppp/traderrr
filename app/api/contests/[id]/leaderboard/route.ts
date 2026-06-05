import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireUser } from "@/lib/api-auth";
import { apiHandler } from "@/lib/errors";
import { getContestLeaderboard } from "@/services/contest.service";

export const GET = apiHandler(async (_req, context) => {
  await connectDB();
  const user = await requireUser();
  const { id } = await (context?.params ?? Promise.resolve({ id: "" }));
  const leaderboard = await getContestLeaderboard(id, user._id.toString());
  return NextResponse.json({ leaderboard });
});
