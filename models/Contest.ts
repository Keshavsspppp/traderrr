import mongoose, { Schema, Document } from "mongoose";

export interface IContest extends Document {
  title: string;

  startingBalance: number;

  participants: string[];

  startDate: Date;

  endDate: Date;
}

const ContestSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    startingBalance: {
      type: Number,
      default: 100000,
    },

    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    startDate: Date,

    endDate: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Contest ||
  mongoose.model<IContest>(
    "Contest",
    ContestSchema
  );