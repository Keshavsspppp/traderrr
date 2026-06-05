import type { IUser } from "@/models/User";
import User from "@/models/User";
import Stock from "@/models/Stock";
import Holding from "@/models/Holding";
import Transaction from "@/models/Transaction";
import PortfolioSnapshot from "@/models/PortfolioSnapshot";
import Contest from "@/models/Contest";
import ContestAccount from "@/models/ContestAccount";
import { AppError } from "@/lib/errors";
import mongoose, { type ClientSession, Types } from "mongoose";
import {
  refreshContestAccountPortfolioValue,
  refreshUserPortfolioValue,
} from "@/services/portfolio.service";
import { getContestStatus } from "@/services/contest.service";
import { awardTradeXp } from "@/services/gamification.service";
import { createNotification } from "@/services/notification.service";
import { formatCurrency } from "@/lib/format";
import type { TradeInput } from "@/lib/validations/trade";

export type TradeResult = {
  transaction: {
    symbol: string;
    quantity: number;
    price: number;
    type: "BUY" | "SELL";
  };
  cashBalance: number;
  totalPortfolioValue: number;
};

type TradeDbResult = TradeResult & { userId: string };

async function executeTradeDb(
  userId: Types.ObjectId | string,
  input: TradeInput,
  session: ClientSession
): Promise<TradeDbResult> {
  const { symbol, quantity, type, contestId } = input;
  const contestObjectId = contestId ? new Types.ObjectId(contestId) : null;

  const txUser = await User.findById(userId).session(session);
  if (!txUser) throw new AppError("User not found", 404, "USER_NOT_FOUND");

  const contest =
    contestObjectId != null
      ? await Contest.findById(contestObjectId).session(session)
      : null;

  const contestAccount =
    contestObjectId != null
      ? await ContestAccount.findOne({
          contestId: contestObjectId,
          userId: txUser._id,
          leftAt: null,
        }).session(session)
      : null;

  if (contestObjectId != null) {
    if (!contest) throw new AppError("Contest not found", 404, "CONTEST_NOT_FOUND");
    if (!contestAccount) {
      throw new AppError("You are not in this contest", 403, "CONTEST_NOT_JOINED");
    }
    const status = getContestStatus(contest);
    if (status !== "ACTIVE") {
      throw new AppError("Contest is not active", 400, "CONTEST_NOT_ACTIVE");
    }
  }

  const stock = await Stock.findOne({ symbol }).session(session);
  if (!stock) throw new AppError("Stock not found", 404, "STOCK_NOT_FOUND");

  const price = stock.currentPrice;
  const total = price * quantity;

  const cashHolder = contestAccount ?? txUser;
  const scope = { contestId: contestObjectId ?? null };

  if (type === "BUY") {
    if (cashHolder.cashBalance < total) {
      throw new AppError("Insufficient cash balance", 400, "INSUFFICIENT_CASH");
    }

    cashHolder.cashBalance -= total;

    const holding = await Holding.findOne({ userId: txUser._id, stockSymbol: symbol, ...scope }).session(
      session
    );
    if (holding) {
      const newQty = holding.quantity + quantity;
      holding.avgBuyPrice =
        (holding.avgBuyPrice * holding.quantity + price * quantity) / newQty;
      holding.quantity = newQty;
      holding.currentPrice = price;
      await holding.save({ session });
    } else {
      await Holding.create(
        [
          {
            userId: txUser._id,
            contestId: contestObjectId ?? null,
            stockSymbol: symbol,
            quantity,
            avgBuyPrice: price,
            currentPrice: price,
          },
        ],
        { session }
      );
    }
  } else {
    const holding = await Holding.findOne({ userId: txUser._id, stockSymbol: symbol, ...scope }).session(
      session
    );
    if (!holding || holding.quantity < quantity) {
      throw new AppError("Insufficient shares to sell", 400, "INSUFFICIENT_SHARES");
    }

    cashHolder.cashBalance += total;
    holding.quantity -= quantity;
    holding.currentPrice = price;

    if (holding.quantity === 0) {
      await holding.deleteOne({ session });
    } else {
      await holding.save({ session });
    }
  }

  await Transaction.create(
    [
      {
        userId: txUser._id,
        contestId: contestObjectId ?? null,
        stockSymbol: symbol,
        quantity,
        price,
        type,
      },
    ],
    { session }
  );

  const totalPortfolioValue =
    contestAccount != null
      ? await refreshContestAccountPortfolioValue(contestAccount, { session })
      : await refreshUserPortfolioValue(txUser, { session });

  await PortfolioSnapshot.create(
    [
      {
        userId: txUser._id,
        contestId: contestObjectId ?? null,
        value: totalPortfolioValue,
        date: new Date(),
      },
    ],
    { session }
  );

  return {
    userId: txUser._id.toString(),
    transaction: { symbol, quantity, price, type },
    cashBalance: cashHolder.cashBalance,
    totalPortfolioValue,
  };
}

export async function runTradeSideEffects(
  userId: Types.ObjectId | string,
  transaction: TradeResult["transaction"],
  options?: { contestId?: string | null }
) {
  const user = await User.findById(userId);
  if (user) {
    await awardTradeXp(user);
  }

  const contestId = options?.contestId;
  await createNotification({
    userId,
    type: "trade",
    title: `${transaction.type} order executed`,
    message: `${transaction.quantity} × ${transaction.symbol} at ${formatCurrency(transaction.price)}`,
    link: contestId ? `/contests/${contestId}/portfolio` : "/portfolio",
  });
}

export async function executeTradeWithSession(
  userId: Types.ObjectId | string,
  input: TradeInput,
  session: ClientSession
) {
  const result = await executeTradeDb(userId, input, session);
  return {
    transaction: result.transaction,
    cashBalance: result.cashBalance,
    totalPortfolioValue: result.totalPortfolioValue,
  };
}

export async function executeTrade(user: IUser, input: TradeInput) {
  const session = await mongoose.startSession();
  let transaction: TradeResult["transaction"] | null = null;
  let cashBalance = 0;
  let totalPortfolioValue = 0;
  try {
    await session.withTransaction(async () => {
      const result = await executeTradeDb(user._id, input, session);
      transaction = result.transaction;
      cashBalance = result.cashBalance;
      totalPortfolioValue = result.totalPortfolioValue;
    });
  } finally {
    session.endSession();
  }

  if (!transaction) {
    throw new AppError("Trade failed", 500, "TRADE_FAILED");
  }

  await runTradeSideEffects(user._id, transaction, { contestId: input.contestId ?? null });
  return {
    transaction,
    cashBalance,
    totalPortfolioValue,
  };
}
