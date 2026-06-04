import mongoose, { Schema, Document, Types } from "mongoose";

export interface IHolding extends Document {
  userId: Types.ObjectId;
  stockSymbol: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
}

const HoldingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    stockSymbol: { type: String, required: true },
    quantity: { type: Number, required: true },
    avgBuyPrice: { type: Number, required: true },
    currentPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

HoldingSchema.index({ userId: 1, stockSymbol: 1 }, { unique: true });

export default mongoose.models.Holding ||
  mongoose.model<IHolding>("Holding", HoldingSchema);
