import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireUser } from "@/lib/api-auth";
import { apiHandler } from "@/lib/errors";
import {
  getHoldingsForUser,
  getAllocationBySector,
  getRoiPercent,
  computePortfolioValue,
} from "@/services/portfolio.service";
import { INITIAL_VIRTUAL_CASH } from "@/lib/constants";

export const GET = apiHandler(async () => {
  await connectDB();
  const user = await requireUser();
  const userId = user._id.toString();

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
