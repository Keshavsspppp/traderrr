    import mongoose, { Schema, Document } from "mongoose";

export interface IHolding extends Document {
  userId: string;

  stockSymbol: string;

  quantity: number;

  avgBuyPrice: number;

  currentPrice: number;
}

const HoldingSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    stockSymbol: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    avgBuyPrice: {
      type: Number,
      required: true,
    },

    currentPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Holding ||
  mongoose.model<IHolding>(
    "Holding",
    HoldingSchema
  );    