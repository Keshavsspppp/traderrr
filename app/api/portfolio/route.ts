import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireUser } from "@/lib/api-auth";
import { apiHandler, AppError } from "@/lib/errors";
import {
  getHoldingsForUser,
  getAllocationBySector,
  getRoiPercent,
  getRoiPercentForBalance,
  computePortfolioValue,
  computePortfolioValueFromCash,
} from "@/services/portfolio.service";
import { INITIAL_VIRTUAL_CASH } from "@/lib/constants";
import ContestAccount from "@/models/ContestAccount";

export const GET = apiHandler(async (req) => {
  await connectDB();
  const user = await requireUser();
  const userId = user._id.toString();

  const url = new URL(req.url);
  const contestId = url.searchParams.get("contestId");

  if (contestId) {
    const account = await ContestAccount.findOne({
      contestId,
      userId: user._id,
      leftAt: null,
    });
    if (!account) {
      throw new AppError("Not in contest", 403, "CONTEST_NOT_JOINED");
    }

    const holdings = await getHoldingsForUser(userId, { contestId });
    const totalValue = await computePortfolioValueFromCash(userId, account.cashBalance, {
      contestId,
    });
    const invested = holdings.reduce((s, h) => s + h.invested, 0);
    const totalProfit = totalValue - account.startingBalance;
    const roi = getRoiPercentForBalance(totalValue, account.startingBalance);
    const allocation = getAllocationBySector(holdings);

    return NextResponse.json({
      holdings,
      allocation,
      performance: {
        portfolioValue: totalValue,
        investedAmount: invested || account.startingBalance - account.cashBalance,
        totalProfit,
        roi,
        cashBalance: account.cashBalance,
        startingBalance: account.startingBalance,
      },
    });
  }

  const holdings = await getHoldingsForUser(userId);
  const totalValue = await computePortfolioValue(user);
  const invested = holdings.reduce((s, h) => s + h.invested, 0);
  const totalProfit = totalValue - INITIAL_VIRTUAL_CASH;
  const roi = getRoiPercent(totalValue);
  const allocation = getAllocationBySector(holdings);

  return NextResponse.json({
    holdings,
    allocation,
    performance: {
      portfolioValue: totalValue,
      investedAmount: invested || INITIAL_VIRTUAL_CASH - user.cashBalance,
      totalProfit,
      roi,
      cashBalance: user.cashBalance,
    },
  });
});
