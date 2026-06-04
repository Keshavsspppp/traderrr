import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireUser } from "@/lib/api-auth";
import { toSafeUser } from "@/lib/session";
import { apiHandler } from "@/lib/errors";
import { getXpProgress } from "@/services/gamification.service";
import { processAchievements } from "@/services/gamification.service";
import { getCurrentUserRank } from "@/services/leaderboard.service";
import { getRoiPercent } from "@/services/portfolio.service";
import { ACHIEVEMENT_DEFS } from "@/lib/constants";

export const GET = apiHandler(async () => {
  await connectDB();
  const user = await requireUser();
  await processAchievements(user);

  const rank = await getCurrentUserRank(user._id.toString());
  const xpProgress = getXpProgress(user.xp, user.level);
  const roi = getRoiPercent(user.totalPortfolioValue);

  const achievements = Object.values(ACHIEVEMENT_DEFS).map((def) => ({
    ...def,
    earned: user.achievements.includes(def.id),
  }));

  return NextResponse.json({
    user: toSafeUser(user),
    rank,
    roi,
    xpProgress,
    achievements,
  });
});
