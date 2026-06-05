import mongoose, { Schema, Document, Types } from "mongoose";

export type OrderType = "MARKET" | "LIMIT" | "STOP_LOSS";
export type OrderStatus = "PENDING" | "FILLED" | "CANCELLED";

export interface IPendingOrder extends Document {
  userId: Types.ObjectId;
  stockSymbol: string;
  quantity: number;
  type: "BUY" | "SELL";
  orderType: OrderType;
  limitPrice: number;
  status: OrderStatus;
  filledPrice?: number;
  filledAt?: Date;
}

const PendingOrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    stockSymbol: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    type: { type: String, enum: ["BUY", "SELL"], required: true },
    orderType: {
      type: String,
      enum: ["MARKET", "LIMIT", "STOP_LOSS"],
      required: true,
    },
    limitPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["PENDING", "FILLED", "CANCELLED"],
      default: "PENDING",
    },
    filledPrice: { type: Number },
    filledAt: { type: Date },
  },
  { timestamps: true }
);

PendingOrderSchema.index({ userId: 1, status: 1 });
PendingOrderSchema.index({ status: 1, stockSymbol: 1 });

export default mongoose.models.PendingOrder ||
  mongoose.model<IPendingOrder>("PendingOrder", PendingOrderSchema);
