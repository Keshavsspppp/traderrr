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
import { INITIAL_VIRTUAL_CASH } from "@/lib/constants";

export async function getDashboardData(userId: string) {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);
  const holdings = await getHoldingsForUser(userId);
  const totalValue = await computePortfolioValue(user);
  const roi = getRoiPercent(totalValue);
  const totalReturn = totalValue - INITIAL_VIRTUAL_CASH;

  if (Math.abs((user.totalPortfolioValue ?? 0) - totalValue) > 0.01) {
    user.totalPortfolioValue = totalValue;
    await user.save();
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const hasTodaySnapshot = await PortfolioSnapshot.exists({
    userId: user._id,
    date: { $gte: today },
  });
  if (!hasTodaySnapshot) {
    await PortfolioSnapshot.create({
      userId: user._id,
      value: totalValue,
      date: new Date(),
    });
  }

  const holdingsValue = holdings.reduce((s, h) => s + h.currentValue, 0);
  const previousCloseValue = holdings.reduce(
    (s, h) => s + (h.previousClose ?? h.currentPrice) * h.quantity,
    0
  );
  const dailyPnL = holdings.reduce(
    (s, h) => s + (h.currentPrice - (h.previousClose ?? h.currentPrice)) * h.quantity,
    0
  );
  const previousPortfolioValue = user.cashBalance + previousCloseValue;
  const dailyPnLPercent =
    previousPortfolioValue > 0 ? (dailyPnL / previousPortfolioValue) * 100 : 0;

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

  const rank = await getCurrentUserRank(userId, totalValue);

  return {
    portfolio: {
      totalValue,
      cashBalance: user.cashBalance,
      dailyPnL,
      dailyPnLPercent,
      dailyChange: dailyPnLPercent,
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
  };
}
