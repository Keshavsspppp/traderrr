import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;

  role: string;

  cashBalance: number;

  totalPortfolioValue: number;

  xp: number;

  level: number;

  avatar?: string;
}

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "USER",
    },

    cashBalance: {
      type: Number,
      default: 100000,
    },

    totalPortfolioValue: {
      type: Number,
      default: 100000,
    },

    xp: {
      type: Number,
      default: 0,
    },

    level: {
      type: Number,
      default: 1,
    },

    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);