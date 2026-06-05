import Holding from "@/models/Holding";
import Stock from "@/models/Stock";
import type { IUser } from "@/models/User";
import type { IContestAccount } from "@/models/ContestAccount";
import type { ClientSession } from "mongoose";
import { INITIAL_VIRTUAL_CASH } from "@/lib/constants";

export async function getHoldingsForUser(
  userId: string,
  options?: { session?: ClientSession; contestId?: string | null }
) {
  const session = options?.session;
  const holdingsQuery = Holding.find({
    userId,
    contestId: options?.contestId ?? null,
  });
  if (session) holdingsQuery.session(session);
  const holdings = await holdingsQuery;
  const symbols = holdings.map((h) => h.stockSymbol);
  const stocksQuery = Stock.find({ symbol: { $in: symbols } });
  if (session) stocksQuery.session(session);
  const stocks = await stocksQuery;
  const priceMap = new Map(stocks.map((s) => [s.symbol, s]));

  return holdings.map((h) => {
    const stock = priceMap.get(h.stockSymbol);
    const currentPrice = stock?.currentPrice ?? h.currentPrice;
    const previousClose = stock?.previousClose ?? currentPrice;
    const invested = h.avgBuyPrice * h.quantity;
    const currentValue = currentPrice * h.quantity;
    const pnl = currentValue - invested;
    const pnlPercent = invested > 0 ? (pnl / invested) * 100 : 0;

    return {
      stockSymbol: h.stockSymbol,
      companyName: stock?.companyName ?? h.stockSymbol,
      sector: stock?.sector ?? "Other",
      quantity: h.quantity,
      avgBuyPrice: h.avgBuyPrice,
      currentPrice,
      previousClose,
      invested,
      currentValue,
      pnl,
      pnlPercent,
    };
  });
}

export async function computePortfolioValueFromCash(
  userId: string,
  cashBalance: number,
  options?: { session?: ClientSession; contestId?: string | null }
) {
  const holdings = await getHoldingsForUser(userId, options);
  const holdingsValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  return cashBalance + holdingsValue;
}

export async function computePortfolioValue(
  user: IUser,
  options?: { session?: ClientSession; contestId?: string | null }
) {
  return computePortfolioValueFromCash(user._id.toString(), user.cashBalance, options);
}

export async function refreshUserPortfolioValue(
  user: IUser,
  options?: { session?: ClientSession }
) {
  const total = await computePortfolioValue(user, options);
  user.totalPortfolioValue = total;
  await user.save({ session: options?.session });
  return total;
}

export async function refreshContestAccountPortfolioValue(
  account: IContestAccount,
  options?: { session?: ClientSession }
) {
  const total = await computePortfolioValueFromCash(
    account.userId.toString(),
    account.cashBalance,
    { ...options, contestId: account.contestId.toString() }
  );
  account.totalPortfolioValue = total;
  await account.save({ session: options?.session });
  return total;
}

export function getRoiPercent(totalValue: number) {
  return ((totalValue - INITIAL_VIRTUAL_CASH) / INITIAL_VIRTUAL_CASH) * 100;
}

export function getRoiPercentForBalance(totalValue: number, startingBalance: number) {
  if (!startingBalance) return 0;
  return ((totalValue - startingBalance) / startingBalance) * 100;
}

export function getAllocationBySector(
  holdings: Awaited<ReturnType<typeof getHoldingsForUser>>
) {
  const total = holdings.reduce((s, h) => s + h.currentValue, 0) || 1;
  const sectorMap = new Map<string, number>();

  for (const h of holdings) {
    sectorMap.set(h.sector, (sectorMap.get(h.sector) ?? 0) + h.currentValue);
  }

  return Array.from(sectorMap.entries()).map(([name, value]) => ({
    name,
    value: Math.round((value / total) * 100),
  }));
}

export function getSectorConcentration(
  allocation: { name: string; value: number }[]
) {
  if (allocation.length === 0) return { topSector: "None", concentration: 0 };
  const top = allocation.reduce((a, b) => (a.value > b.value ? a : b));
  return { topSector: top.name, concentration: top.value / 100 };
}
