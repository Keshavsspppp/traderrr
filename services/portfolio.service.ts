import Holding from "@/models/Holding";
import Stock from "@/models/Stock";
import type { IUser } from "@/models/User";
import { INITIAL_VIRTUAL_CASH } from "@/lib/constants";

export async function getHoldingsForUser(userId: string) {
  const holdings = await Holding.find({ userId });
  const symbols = holdings.map((h) => h.stockSymbol);
  const stocks = await Stock.find({ symbol: { $in: symbols } });
  const priceMap = new Map(stocks.map((s) => [s.symbol, s]));

  return holdings.map((h) => {
    const stock = priceMap.get(h.stockSymbol);
    const currentPrice = stock?.currentPrice ?? h.currentPrice;
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
      invested,
      currentValue,
      pnl,
      pnlPercent,
    };
  });
}

export async function computePortfolioValue(user: IUser) {
  const holdings = await getHoldingsForUser(user._id.toString());
  const holdingsValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  return user.cashBalance + holdingsValue;
}

export async function refreshUserPortfolioValue(user: IUser) {
  const total = await computePortfolioValue(user);
  user.totalPortfolioValue = total;
  await user.save();
  return total;
}

export function getRoiPercent(totalValue: number) {
  return ((totalValue - INITIAL_VIRTUAL_CASH) / INITIAL_VIRTUAL_CASH) * 100;
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
