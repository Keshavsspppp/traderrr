import { Crown, Medal, Trophy } from "lucide-react";
import { formatCurrency, formatPercent } from "@/lib/format";

export type InvestorRank = {
  rank: number;
  name: string;
  portfolioValue: number;
  returns: number;
};

const icons = [Crown, Trophy, Medal];
const colors = ["text-yellow-400", "text-zinc-300", "text-amber-600"];

export default function TopInvestors({ investors }: { investors: InvestorRank[] }) {
  const top3 = investors.slice(0, 3);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {top3.map((investor, i) => {
        const Icon = icons[i] ?? Trophy;
        return (
          <div
            key={investor.rank}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between">
              <Icon size={34} className={colors[i]} />
              <span className="text-3xl font-bold">#{investor.rank}</span>
            </div>
            <h3 className="mt-6 text-xl font-semibold">{investor.name}</h3>
            <p className="mt-2 text-lg text-green-400">{formatPercent(investor.returns)}</p>
            <p className="mt-1 text-sm text-zinc-400">{formatCurrency(investor.portfolioValue)}</p>
          </div>
        );
      })}
    </div>
  );
}
