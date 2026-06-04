import { connectDB } from "@/lib/mongodb";
import { getTokenFromCookies } from "@/lib/cookies";
import { verifyToken } from "@/lib/jwt";
import User, { type IUser } from "@/models/User";
import { AppError } from "@/lib/errors";

export async function requireUser(): Promise<IUser> {
  const token = await getTokenFromCookies();
  if (!token) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  const payload = verifyToken(token);
  if (!payload) {
    throw new AppError("Invalid or expired token", 401, "UNAUTHORIZED");
  }

  await connectDB();
  const user = await User.findById(payload.userId);
  if (!user) {
    throw new AppError("User not found", 401, "UNAUTHORIZED");
  }

  return user;
}
