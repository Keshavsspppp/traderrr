import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireUser } from "@/lib/api-auth";
import { apiHandler, AppError } from "@/lib/errors";
import { contestJoinSchema } from "@/lib/validations/contest";
import { joinContest } from "@/services/contest.service";

export const POST = apiHandler(async (req, context) => {
  await connectDB();
  const user = await requireUser();
  const { id } = await (context?.params ?? Promise.resolve({ id: "" }));

  const body = await req.json().catch(() => ({}));
  const parsed = contestJoinSchema.safeParse(body ?? {});
  if (!parsed.success) {
    throw new AppError(parsed.error.issues[0]?.message ?? "Invalid join request", 400);
  }

  const result = await joinContest(user._id.toString(), id, parsed.data);
  return NextResponse.json(result);
});
