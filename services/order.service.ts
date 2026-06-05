import User, { type IUser } from "@/models/User";
import Stock from "@/models/Stock";
import PendingOrder, { type IPendingOrder } from "@/models/PendingOrder";
import { AppError } from "@/lib/errors";
import mongoose from "mongoose";
import { executeTrade, executeTradeWithSession, runTradeSideEffects } from "@/services/trade.service";
import { createNotification } from "@/services/notification.service";
import { formatCurrency } from "@/lib/format";
import type { OrderInput } from "@/lib/validations/order";

function shouldFill(order: IPendingOrder, currentPrice: number): boolean {
  if (order.orderType === "MARKET") return true;

  if (order.orderType === "LIMIT") {
    if (order.type === "BUY") return currentPrice <= order.limitPrice;
    return currentPrice >= order.limitPrice;
  }

  // STOP_LOSS — sell when price drops to/below stop; buy stop when price rises to/above
  if (order.type === "SELL") return currentPrice <= order.limitPrice;
  return currentPrice >= order.limitPrice;
}

export async function placeOrder(user: IUser, input: OrderInput) {
  const stock = await Stock.findOne({ symbol: input.symbol });
  if (!stock) {
    throw new AppError("Stock not found", 404, "STOCK_NOT_FOUND");
  }

  if (input.orderType === "MARKET") {
    return executeTrade(user, {
      symbol: input.symbol,
      quantity: input.quantity,
      type: input.type,
    });
  }

  const order = await PendingOrder.create({
    userId: user._id,
    stockSymbol: input.symbol,
    quantity: input.quantity,
    type: input.type,
    orderType: input.orderType,
    limitPrice: input.limitPrice!,
    status: "PENDING",
  });

  const filled = await tryFillOrder(order._id.toString(), stock.currentPrice);
  if (filled) {
    return { order: filled, immediate: true };
  }

  await createNotification({
    userId: user._id,
    type: "order",
    title: `${input.orderType.replace("_", " ")} order placed`,
    message: `${input.type} ${input.quantity} × ${input.symbol} @ ${formatCurrency(input.limitPrice!)}`,
    link: "/portfolio",
  });

  return { order, immediate: false };
}

async function tryFillOrder(orderId: string, currentPrice: number) {
  const session = await mongoose.startSession();
  let filled: IPendingOrder | null = null;
  let filledUserId: string | null = null;
  let executed: { symbol: string; quantity: number; price: number; type: "BUY" | "SELL" } | null =
    null;

  try {
    await session.withTransaction(async () => {
      const order = await PendingOrder.findById(orderId).session(session);
      if (!order || order.status !== "PENDING") return;
      if (!shouldFill(order, currentPrice)) return;

      const user = await User.findById(order.userId).session(session);
      if (!user) return;

      const result = await executeTradeWithSession(
        user._id,
        {
          symbol: order.stockSymbol,
          quantity: order.quantity,
          type: order.type,
        },
        session
      );

      executed = result.transaction;

      order.status = "FILLED";
      order.filledPrice = result.transaction.price;
      order.filledAt = new Date();
      await order.save({ session });

      filled = order;
      filledUserId = order.userId.toString();
    });
  } catch {
    return null;
  } finally {
    session.endSession();
  }

  if (filled && executed && filledUserId) {
    await runTradeSideEffects(filledUserId, executed);
  }

  return filled;
}

export async function processPendingOrders() {
  const pending = await PendingOrder.find({ status: "PENDING" });
  let filled = 0;

  for (const order of pending) {
    const stock = await Stock.findOne({ symbol: order.stockSymbol });
    if (!stock) continue;

    const result = await tryFillOrder(order._id.toString(), stock.currentPrice);
    if (result) filled += 1;
  }

  return { processed: pending.length, filled };
}

export async function cancelOrder(userId: string, orderId: string) {
  const order = await PendingOrder.findOne({
    _id: orderId,
    userId,
    status: "PENDING",
  });
  if (!order) {
    throw new AppError("Order not found", 404);
  }
  order.status = "CANCELLED";
  await order.save();
  return order;
}

export async function getUserOrders(userId: string) {
  return PendingOrder.find({ userId })
    .sort({ createdAt: -1 })
    .limit(20);
}
