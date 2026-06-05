import Transaction from "@/models/Transaction";
import PortfolioSnapshot from "@/models/PortfolioSnapshot";
import User from "@/models/User";
import { AppError } from "@/lib/errors";
import {
  getHoldingsForUser,
  getRoiPercent,
  computePortfolioValue,
} from "@/services/portfolio.service";
import { getCurrentUserRank } from "@/services/leaderboard.service";
import { generatePortfolioInsight } from "@/services/ai/mentor.service";
import { INITIAL_VIRTUAL_CASH } from "@/lib/constants";

export async function getDashboardData(userId: string) {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);
  const holdings = await getHoldingsForUser(userId);
  const totalValue = await computePortfolioValue(user);
  const roi = getRoiPercent(totalValue);
  const totalReturn = totalValue - INITIAL_VIRTUAL_CASH;

  const holdingsValue = holdings.reduce((s, h) => s + h.currentValue, 0);
  const dailyPnL = holdings.reduce((s, h) => {
    const stockChange = h.currentPrice - h.avgBuyPrice;
    return s + stockChange * h.quantity * 0.01;
  }, 0);
  const dailyPnLPercent = totalValue > 0 ? (dailyPnL / totalValue) * 100 : 0;

  const recentTransactions = await Transaction.find({ userId: user._id })
    .sort({ createdAt: -1 })
    .limit(10);

  const snapshots = await PortfolioSnapshot.find({ userId: user._id })
    .sort({ date: -1 })
    .limit(30);

  const chartData =
    snapshots.length > 0
      ? snapshots.reverse().map((s) => ({
          label: new Date(s.date).toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
          }),
          value: s.value,
        }))
      : [{ label: "Start", value: INITIAL_VIRTUAL_CASH }, { label: "Now", value: totalValue }];

  const rank = await getCurrentUserRank(userId, user.totalPortfolioValue);
  const aiInsight = await generatePortfolioInsight(user);

  return {
    portfolio: {
      totalValue,
      cashBalance: user.cashBalance,
      dailyPnL,
      dailyPnLPercent,
      dailyChange: roi,
      totalReturn,
      roi,
    },
    holdingsValue,
    globalRank: rank,
    recentTrades: recentTransactions.map((t) => ({
      stock: t.stockSymbol,
      type: t.type,
      quantity: t.quantity,
      price: t.price,
      date: t.createdAt,
    })),
    chartData,
    aiInsight,
  };
}
