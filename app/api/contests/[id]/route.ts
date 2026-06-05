import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireUser } from "@/lib/api-auth";
import { apiHandler } from "@/lib/errors";
import { getContest, getContestCreatorName } from "@/services/contest.service";

export const GET = apiHandler(async (_req, context) => {
  await connectDB();
  const user = await requireUser();
  const { id } = await (context?.params ?? Promise.resolve({ id: "" }));
  const contest = await getContest(id, user._id.toString());
  const creatorName = await getContestCreatorName(id);
  return NextResponse.json({ contest: { ...contest, creatorName } });
});
