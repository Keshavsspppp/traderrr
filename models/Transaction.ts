import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  userId: string;

  stockSymbol: string;

  quantity: number;

  price: number;

  type: "BUY" | "SELL";
}

const TransactionSchema = new Schema(
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

    price: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      enum: ["BUY", "SELL"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Transaction ||
  mongoose.model<ITransaction>(
    "Transaction",
    TransactionSchema
  );