import mongoose, { Schema, Document } from "mongoose";

export interface IStock extends Document {
  symbol: string;
  companyName: string;
  sector: string;
  currentPrice: number;
  marketCap: number;
}

const StockSchema = new Schema(
  {
    symbol: {
      type: String,
      required: true,
      unique: true,
    },

    companyName: {
      type: String,
      required: true,
    },

    sector: {
      type: String,
      required: true,
    },

    currentPrice: {
      type: Number,
      required: true,
    },

    marketCap: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Stock ||
  mongoose.model<IStock>("Stock", StockSchema);