import User, { type IUser } from "@/models/User";
import Stock from "@/models/Stock";
import PendingOrder, { type IPendingOrder } from "@/models/PendingOrder";
import { AppError } from "@/lib/errors";
import { executeTrade } from "@/services/trade.service";
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

  const filled = await tryFillOrder(order, stock.currentPrice);
  if (filled) {
    return { order: filled, immediate: true };
  }

  return { order, immediate: false };
}

async function tryFillOrder(order: IPendingOrder, currentPrice: number) {
  if (order.status !== "PENDING") return null;
  if (!shouldFill(order, currentPrice)) return null;

  const user = await User.findById(order.userId);
  if (!user) return null;

  await executeTrade(user, {
    symbol: order.stockSymbol,
    quantity: order.quantity,
    type: order.type,
  });

  order.status = "FILLED";
  order.filledPrice = currentPrice;
  order.filledAt = new Date();
  await order.save();

  return order;
}

export async function processPendingOrders() {
  const pending = await PendingOrder.find({ status: "PENDING" });
  let filled = 0;

  for (const order of pending) {
    const stock = await Stock.findOne({ symbol: order.stockSymbol });
    if (!stock) continue;

    const result = await tryFillOrder(order, stock.currentPrice);
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
