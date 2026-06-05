import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITransaction extends Document {
  userId: Types.ObjectId;

  contestId?: Types.ObjectId | null;

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

    contestId: {
      type: Schema.Types.ObjectId,
      ref: "Contest",
      default: null,
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
