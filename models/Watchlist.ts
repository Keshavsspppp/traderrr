import mongoose, { Schema, Document } from "mongoose";

export interface IWatchlist extends Document {
  userId: string;

  stocks: string[];
}

const WatchlistSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    stocks: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Watchlist ||
  mongoose.model<IWatchlist>(
    "Watchlist",
    WatchlistSchema
  );