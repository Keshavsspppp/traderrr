import User from "@/models/User";
import { getRoiPercent } from "@/services/portfolio.service";
import { INITIAL_VIRTUAL_CASH } from "@/lib/constants";

export async function getLeaderboard(currentUserId?: string) {
  const users = await User.find()
    .sort({ totalPortfolioValue: -1 })
    .limit(50)
    .select("name totalPortfolioValue cashBalance");

  return users.map((user, index) => {
    const roi = getRoiPercent(user.totalPortfolioValue);
    return {
      rank: index + 1,
      userId: user._id.toString(),
      name: user.name,
      portfolioValue: user.totalPortfolioValue,
      returns: roi,
      isCurrentUser: user._id.toString() === currentUserId,
    };
  });
}

export async function getCurrentUserRank(
  userId: string,
  portfolioValue?: number
) {
  let value = portfolioValue;
  if (value == null) {
    const user = await User.findById(userId).select("totalPortfolioValue");
    if (!user) return 1;
    value = user.totalPortfolioValue;
  }
  const higher = await User.countDocuments({
    totalPortfolioValue: { $gt: value },
  });
  return higher + 1;
}

export function formatReturns(roi: number) {
  const sign = roi >= 0 ? "+" : "";
  return `${sign}${roi.toFixed(1)}%`;
}

export function getGlobalRankLabel(rank: number) {
  return `#${rank}`;
}
