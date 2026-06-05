import User, { type IUser } from "@/models/User";
import Transaction from "@/models/Transaction";
import { ACHIEVEMENT_DEFS, LEVEL_XP_THRESHOLDS } from "@/lib/constants";
import { getRoiPercent } from "@/services/portfolio.service";

export function calculateLevelFromXp(xp: number): number {
  let level = 1;
  for (let i = LEVEL_XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_XP_THRESHOLDS[i]) {
      level = i + 1;
      break;
    }
  }
  return Math.min(level, LEVEL_XP_THRESHOLDS.length);
}

export function getXpProgress(xp: number, level: number) {
  const currentThreshold = LEVEL_XP_THRESHOLDS[level - 1] ?? 0;
  const nextThreshold =
    LEVEL_XP_THRESHOLDS[level] ?? LEVEL_XP_THRESHOLDS[LEVEL_XP_THRESHOLDS.length - 1];
  if (level >= LEVEL_XP_THRESHOLDS.length) {
    return { current: xp, next: nextThreshold, percent: 100 };
  }
  const percent =
    ((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  return { current: xp, next: nextThreshold, percent: Math.min(100, Math.max(0, percent)) };
}

async function getLeaderboardRank(user: IUser): Promise<number> {
  const higher = await User.countDocuments({
    totalPortfolioValue: { $gt: user.totalPortfolioValue },
  });
  return higher + 1;
}

export async function processAchievements(user: IUser) {
  const tradeCount = await Transaction.countDocuments({ userId: user._id });
  const rank = await getLeaderboardRank(user);
  const roi = getRoiPercent(user.totalPortfolioValue);

  const checks: { id: string; met: boolean }[] = [
    { id: "first_trade", met: tradeCount >= 1 },
    { id: "trades_10", met: tradeCount >= 10 },
    { id: "top_100", met: rank <= 100 },
    { id: "growth_20", met: roi >= 20 },
  ];

  let xpGain = 0;
  const earned: string[] = [];

  for (const check of checks) {
    if (check.met && !user.achievements.includes(check.id)) {
      const def = ACHIEVEMENT_DEFS[check.id as keyof typeof ACHIEVEMENT_DEFS];
      user.achievements.push(check.id);
      xpGain += def.xpReward;
      earned.push(check.id);
    }
  }

  if (xpGain > 0) {
    user.xp += xpGain;
    user.level = calculateLevelFromXp(user.xp);
    await user.save();
  } else if (earned.length > 0) {
    await user.save();
  }

  return earned;
}

export async function awardTradeXp(user: IUser) {
  user.xp += 50;
  user.level = calculateLevelFromXp(user.xp);
  await user.save();
  await processAchievements(user);
}
