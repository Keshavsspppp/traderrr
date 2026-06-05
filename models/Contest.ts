import mongoose, { Schema, Document, Types } from "mongoose";

export type ContestRecurrence = "NONE" | "WEEKLY" | "MONTHLY";

export interface IContest extends Document {
  title: string;

  startingBalance: number;

  createdBy: Types.ObjectId;

  participants: Types.ObjectId[];

  startDate: Date;

  endDate: Date;

  isInviteOnly: boolean;

  inviteCodeHash?: string;

  recurrence: ContestRecurrence;

  maxParticipants?: number;
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

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    startDate: Date,

    endDate: Date,

    isInviteOnly: {
      type: Boolean,
      default: false,
    },

    inviteCodeHash: {
      type: String,
    },

    recurrence: {
      type: String,
      enum: ["NONE", "WEEKLY", "MONTHLY"],
      default: "NONE",
    },

    maxParticipants: {
      type: Number,
      min: 2,
    },
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
