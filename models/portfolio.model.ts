import mongoose, { Schema, Document, Types } from "mongoose";
import { INITIAL_VIRTUAL_CASH } from "@/lib/constants";
import Stock from "./Stock";

export interface IPortfolioHolding {
  stockId: Types.ObjectId;
  symbol: string;
  quantity: number;
  averageBuyPrice: number;
  totalInvestment: number;
}

export interface IPortfolio extends Document {
  userId: Types.ObjectId;
  cashBalance: number;
  holdings: IPortfolioHolding[];
  performance: {
    dailyPnL: number;
    weeklyPnL: number;
    monthlyPnL: number;
    totalReturn: number;
    roi: number;
  };
  stats: {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
    averageHoldingPeriod: number;
  };
  aiAnalysis: {
    healthScore: number;
    riskLevel: "LOW" | "MODERATE" | "HIGH" | "EXTREME";
    lastAnalyzed?: Date;
    recommendations: Array<{
      type?: string;
      priority?: "LOW" | "MEDIUM" | "HIGH";
      message?: string;
      action?: string;
      createdAt?: Date;
    }>;
  };
  calculateTotalValue(): Promise<number>;
  updatePerformance(): Promise<void>;
}

const PortfolioSchema = new Schema<IPortfolio>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    cashBalance: {
      type: Number,
      required: true,
      default: INITIAL_VIRTUAL_CASH,
      min: 0,
    },
    holdings: [
      {
        stockId: {
          type: Schema.Types.ObjectId,
          ref: "Stock",
        },
        symbol: String,
        quantity: Number,
        averageBuyPrice: Number,
        totalInvestment: Number,
      },
    ],
    performance: {
      dailyPnL: { type: Number, default: 0 },
      weeklyPnL: { type: Number, default: 0 },
      monthlyPnL: { type: Number, default: 0 },
      totalReturn: { type: Number, default: 0 },
      roi: { type: Number, default: 0 },
    },
    stats: {
      totalTrades: { type: Number, default: 0 },
      winningTrades: { type: Number, default: 0 },
      losingTrades: { type: Number, default: 0 },
      winRate: { type: Number, default: 0 },
      averageHoldingPeriod: { type: Number, default: 0 },
    },
    aiAnalysis: {
      healthScore: { type: Number, default: 0 },
      riskLevel: {
        type: String,
        enum: ["LOW", "MODERATE", "HIGH", "EXTREME"],
        default: "LOW",
      },
      lastAnalyzed: Date,
      recommendations: [
        {
          type: { type: String },
          priority: { type: String, enum: ["LOW", "MEDIUM", "HIGH"] },
          message: String,
          action: String,
          createdAt: { type: Date, default: Date.now },
        },
      ],
    },
  },
  { timestamps: true }
);

PortfolioSchema.index({ "performance.totalReturn": -1 });
PortfolioSchema.index({ "aiAnalysis.healthScore": -1 });
PortfolioSchema.index({ userId: 1, updatedAt: -1 });

PortfolioSchema.methods.calculateTotalValue = async function (
  this: IPortfolio
) {
  let holdingsValue = 0;
  for (const holding of this.holdings) {
    const stock = await Stock.findOne({ symbol: holding.symbol });
    if (stock) {
      holdingsValue += stock.currentPrice * holding.quantity;
    }
  }
  return this.cashBalance + holdingsValue;
};

PortfolioSchema.methods.updatePerformance = async function (this: IPortfolio) {
  const totalValue = await this.calculateTotalValue();
  const initialInvestment = INITIAL_VIRTUAL_CASH;
  this.performance.totalReturn = totalValue - initialInvestment;
  this.performance.roi =
    ((totalValue - initialInvestment) / initialInvestment) * 100;
  await this.save();
};

export default mongoose.models.Portfolio ||
  mongoose.model<IPortfolio>("Portfolio", PortfolioSchema);
