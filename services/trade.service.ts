import type { IUser } from "@/models/User";
import User from "@/models/User";
import Stock from "@/models/Stock";
import Holding from "@/models/Holding";
import Transaction from "@/models/Transaction";
import PortfolioSnapshot from "@/models/PortfolioSnapshot";
import { AppError } from "@/lib/errors";
import {
  refreshUserPortfolioValue,
  computePortfolioValue,
} from "@/services/portfolio.service";
import { awardTradeXp } from "@/services/gamification.service";
import { createNotification } from "@/services/notification.service";
import { formatCurrency } from "@/lib/format";
import type { TradeInput } from "@/lib/validations/trade";

export async function executeTrade(user: IUser, input: TradeInput) {
  const { symbol, quantity, type } = input;

  const stock = await Stock.findOne({ symbol });
  if (!stock) {
    throw new AppError("Stock not found", 404, "STOCK_NOT_FOUND");
  }

  const price = stock.currentPrice;
  const total = price * quantity;
  const userId = user._id;

  if (type === "BUY") {
    if (user.cashBalance < total) {
      throw new AppError("Insufficient cash balance", 400, "INSUFFICIENT_CASH");
    }

    user.cashBalance -= total;

    const holding = await Holding.findOne({ userId, stockSymbol: symbol });
    if (holding) {
      const newQty = holding.quantity + quantity;
      holding.avgBuyPrice =
        (holding.avgBuyPrice * holding.quantity + price * quantity) / newQty;
      holding.quantity = newQty;
      holding.currentPrice = price;
      await holding.save();
    } else {
      await Holding.create({
        userId,
        stockSymbol: symbol,
        quantity,
        avgBuyPrice: price,
        currentPrice: price,
      });
    }
  } else {
    const holding = await Holding.findOne({ userId, stockSymbol: symbol });
    if (!holding || holding.quantity < quantity) {
      throw new AppError("Insufficient shares to sell", 400, "INSUFFICIENT_SHARES");
    }

    user.cashBalance += total;
    holding.quantity -= quantity;
    holding.currentPrice = price;

    if (holding.quantity === 0) {
      await holding.deleteOne();
    } else {
      await holding.save();
    }
  }

  await user.save();

  await Transaction.create({
    userId,
    stockSymbol: symbol,
    quantity,
    price,
    type,
  });

  await refreshUserPortfolioValue(user);

  const snapshotValue = await computePortfolioValue(user);
  await PortfolioSnapshot.create({
    userId,
    value: snapshotValue,
    date: new Date(),
  });

  await awardTradeXp(user);

  await createNotification({
    userId,
    type: "trade",
    title: `${type} order executed`,
    message: `${quantity} × ${symbol} at ${formatCurrency(price)}`,
    link: "/portfolio",
  });

  const updatedUser = await User.findById(userId);
  return {
    transaction: { symbol, quantity, price, type },
    cashBalance: updatedUser?.cashBalance ?? user.cashBalance,
    totalPortfolioValue: updatedUser?.totalPortfolioValue ?? user.totalPortfolioValue,
  };
}
