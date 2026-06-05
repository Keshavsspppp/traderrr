import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { hashPassword } from "@/lib/auth";
import { signToken } from "@/lib/jwt";
import { registerSchema } from "@/lib/validations/auth";
import { setAuthCookie } from "@/lib/cookies";
import { toSafeUser } from "@/lib/session";
import { apiHandler, AppError } from "@/lib/errors";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/ip";
import User from "@/models/User";
import Watchlist from "@/models/Watchlist";
import { INITIAL_VIRTUAL_CASH } from "@/lib/constants";

export const POST = apiHandler(async (req) => {
  const ip = getClientIp(req.headers);
  if (!rateLimit(`register:${ip}`, 10, 60_000)) {
    throw new AppError("Too many requests", 429, "RATE_LIMITED");
  }

  const body = await req.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    throw new AppError(parsed.error.issues[0]?.message ?? "Invalid input", 400);
  }

  const { name, email, password } = parsed.data;
  if (!rateLimit(`register:${ip}:${email.toLowerCase()}`, 5, 60_000)) {
    throw new AppError("Too many requests", 429, "RATE_LIMITED");
  }

  await connectDB();

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new AppError("Email already registered", 409, "EMAIL_EXISTS");
  }

  const hashed = await hashPassword(password);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashed,
    cashBalance: INITIAL_VIRTUAL_CASH,
    totalPortfolioValue: INITIAL_VIRTUAL_CASH,
  });

  await Watchlist.create({ userId: user._id, stocks: [] });

  const token = signToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  const response = NextResponse.json({ user: toSafeUser(user) });
  return setAuthCookie(response, token);
});
