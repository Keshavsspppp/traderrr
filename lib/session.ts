import { connectDB } from "@/lib/mongodb";
import { getTokenFromCookies } from "@/lib/cookies";
import { verifyToken, type JwtPayload } from "@/lib/jwt";
import User, { type IUser } from "@/models/User";
import { INVESTOR_LEVELS } from "@/lib/constants";

export type SafeUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  cashBalance: number;
  totalPortfolioValue: number;
  xp: number;
  level: number;
  levelTitle: string;
  achievements: string[];
  avatar?: string;
  initialBalance: number;
};

const INITIAL_BALANCE = 1_000_000;

export function toSafeUser(user: IUser): SafeUser {
  const level = user.level ?? 1;
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    cashBalance: user.cashBalance,
    totalPortfolioValue: user.totalPortfolioValue,
    xp: user.xp,
    level,
    levelTitle: INVESTOR_LEVELS[Math.min(level - 1, INVESTOR_LEVELS.length - 1)],
    achievements: user.achievements ?? [],
    avatar: user.avatar,
    initialBalance: INITIAL_BALANCE,
  };
}

export async function getSession(): Promise<JwtPayload | null> {
  const token = await getTokenFromCookies();
  if (!token) return null;
  return verifyToken(token);
}

export async function getCurrentUser(): Promise<SafeUser | null> {
  const session = await getSession();
  if (!session) return null;

  await connectDB();
  const user = await User.findById(session.userId).select("-password");
  if (!user) return null;

  return toSafeUser(user);
}
