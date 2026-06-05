import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireUser } from "@/lib/api-auth";
import { apiHandler } from "@/lib/errors";
import { generatePortfolioInsight } from "@/services/ai/mentor.service";

export const GET = apiHandler(async (req) => {
  await connectDB();
  const user = await requireUser();
  const refresh = new URL(req.url).searchParams.get("refresh") === "1";

  const insight = await generatePortfolioInsight(user, { refresh });

  return NextResponse.json({
    ...insight,
    generatedAt: new Date().toISOString(),
  });
});
