import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPortfolioSnapshot extends Document {
  userId: Types.ObjectId;
  value: number;
  date: Date;
}

const PortfolioSnapshotSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    value: { type: Number, required: true },
    date: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

PortfolioSnapshotSchema.index({ userId: 1, date: -1 });

export default mongoose.models.PortfolioSnapshot ||
  mongoose.model<IPortfolioSnapshot>(
    "PortfolioSnapshot",
    PortfolioSnapshotSchema
  );
