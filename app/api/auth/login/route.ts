import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { comparePassword } from "@/lib/auth";
import { signToken } from "@/lib/jwt";
import { loginSchema } from "@/lib/validations/auth";
import { setAuthCookie } from "@/lib/cookies";
import { toSafeUser } from "@/lib/session";
import { apiHandler, AppError } from "@/lib/errors";
import { rateLimit } from "@/lib/rate-limit";
import User from "@/models/User";

export const POST = apiHandler(async (req) => {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(`login:${ip}`)) {
    throw new AppError("Too many requests", 429, "RATE_LIMITED");
  }

  const body = await req.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    throw new AppError(parsed.error.issues[0]?.message ?? "Invalid input", 400);
  }

  const { email, password } = parsed.data;

  await connectDB();
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  const token = signToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  const response = NextResponse.json({ user: toSafeUser(user) });
  return setAuthCookie(response, token);
});
