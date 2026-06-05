import Link from "next/link";
import { Trophy } from "lucide-react";

export default function ContestsComingSoon() {
  return (
    <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent p-8">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-amber-500/20 p-3 text-amber-400">
          <Trophy size={28} />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Portfolio Contests</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">
            Weekly and monthly ROI seasons with isolated paper portfolios. Join a
            contest, trade during the window, and climb the contest leaderboard.
          </p>
          <Link
            href="/contests"
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-300 hover:bg-amber-500/15"
          >
            View contests
          </Link>
        </div>
      </div>
    </div>
  );
}
