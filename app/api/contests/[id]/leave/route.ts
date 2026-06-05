import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireUser } from "@/lib/api-auth";
import { apiHandler } from "@/lib/errors";
import { leaveContest } from "@/services/contest.service";

export const POST = apiHandler(async (_req, context) => {
  await connectDB();
  const user = await requireUser();
  const { id } = await (context?.params ?? Promise.resolve({ id: "" }));
  const result = await leaveContest(user._id.toString(), id);
  return NextResponse.json(result);
});
