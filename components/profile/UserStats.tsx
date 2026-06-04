import { Trophy, Wallet, TrendingUp } from "lucide-react";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { SafeUser } from "@/lib/session";

interface UserStatsProps {
  user: SafeUser;
  rank: number;
  roi: number;
  xpProgress: { current: number; next: number; percent: number };
}

export default function UserStats({ user, rank, roi, xpProgress }: UserStatsProps) {
  const initial = user.name.charAt(0).toUpperCase();

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-green-500 text-4xl font-bold text-black">
          {initial}
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold">{user.name}</h2>
          <p className="mt-2 text-zinc-400">
            {user.levelTitle} · Level {user.level}
          </p>
          <div className="mt-6">
            <div className="mb-2 flex justify-between text-sm">
              <span>XP Progress</span>
              <span>
                {xpProgress.current} / {xpProgress.next}
              </span>
            </div>
            <div className="h-3 rounded-full bg-zinc-800">
              <div
                className="h-3 rounded-full bg-green-500"
                style={{ width: `${xpProgress.percent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-black/20 p-4">
          <Wallet className="mb-2 text-green-400" />
          <p className="text-zinc-400">Portfolio Value</p>
          <h3 className="mt-2 text-2xl font-bold">
            {formatCurrency(user.totalPortfolioValue)}
          </h3>
        </div>
        <div className="rounded-2xl bg-black/20 p-4">
          <TrendingUp className="mb-2 text-green-400" />
          <p className="text-zinc-400">Total Return</p>
          <h3 className="mt-2 text-2xl font-bold text-green-400">{formatPercent(roi)}</h3>
        </div>
        <div className="rounded-2xl bg-black/20 p-4">
          <Trophy className="mb-2 text-green-400" />
          <p className="text-zinc-400">Leaderboard Rank</p>
          <h3 className="mt-2 text-2xl font-bold">#{rank}</h3>
        </div>
      </div>
    </div>
  );
}
