import mongoose, { Schema, Document, Types } from "mongoose";

export interface IContestAccount extends Document {
  contestId: Types.ObjectId;
  userId: Types.ObjectId;
  startingBalance: number;
  cashBalance: number;
  totalPortfolioValue: number;
  joinedAt: Date;
  leftAt?: Date | null;
}

const ContestAccountSchema = new Schema(
  {
    contestId: { type: Schema.Types.ObjectId, ref: "Contest", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    startingBalance: { type: Number, required: true, min: 0 },
    cashBalance: {
      type: Number,
      required: true,
      min: 0,
      default(this: { startingBalance: number }) {
        return this.startingBalance;
      },
    },
    totalPortfolioValue: {
      type: Number,
      required: true,
      min: 0,
      default(this: { startingBalance: number }) {
        return this.startingBalance;
      },
    },
    joinedAt: { type: Date, required: true, default: Date.now },
    leftAt: { type: Date, default: null },
  },
  { timestamps: true }
);

ContestAccountSchema.index({ contestId: 1, userId: 1 }, { unique: true });
ContestAccountSchema.index({ contestId: 1, totalPortfolioValue: -1 });

export default mongoose.models.ContestAccount ||
  mongoose.model<IContestAccount>("ContestAccount", ContestAccountSchema);
