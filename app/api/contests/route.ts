import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireUser } from "@/lib/api-auth";
import { apiHandler, AppError } from "@/lib/errors";
import { contestCreateSchema } from "@/lib/validations/contest";
import { createContest, listContests } from "@/services/contest.service";

export const GET = apiHandler(async () => {
  await connectDB();
  const user = await requireUser();
  const contests = await listContests(user._id.toString());
  return NextResponse.json({ contests });
});

export const POST = apiHandler(async (req) => {
  await connectDB();
  const user = await requireUser();

  const body = await req.json();
  const parsed = contestCreateSchema.safeParse({
    ...body,
    startingBalance: Number(body.startingBalance),
    maxParticipants: body.maxParticipants != null ? Number(body.maxParticipants) : undefined,
  });

  if (!parsed.success) {
    throw new AppError(parsed.error.issues[0]?.message ?? "Invalid contest", 400);
  }

  const result = await createContest(user._id.toString(), parsed.data);
  return NextResponse.json(result);
});
