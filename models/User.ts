import mongoose, { Schema, Document } from "mongoose";
import { INITIAL_VIRTUAL_CASH } from "@/lib/constants";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  cashBalance: number;
  totalPortfolioValue: number;
  xp: number;
  level: number;
  achievements: string[];
  avatar?: string;
}

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "USER" },
    cashBalance: { type: Number, default: INITIAL_VIRTUAL_CASH },
    totalPortfolioValue: { type: Number, default: INITIAL_VIRTUAL_CASH },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    achievements: { type: [String], default: [] },
    avatar: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
