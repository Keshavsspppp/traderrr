import { formatCurrency, formatPercent } from "@/lib/format";

export type InvestorRow = {
  rank: number;
  name: string;
  portfolioValue: number;
  returns: number;
  isCurrentUser?: boolean;
};

export default function LeaderboardTable({ investors }: { investors: InvestorRow[] }) {
  return (
    <div className="card-panel">
      <h2 className="mb-4 text-xl font-semibold sm:mb-6 sm:text-2xl">Global Rankings</h2>

      <div className="space-y-2 md:hidden">
        {investors.map((investor) => (
          <div
            key={investor.rank}
            className={`flex items-center justify-between rounded-2xl border border-white/5 p-4 ${
              investor.isCurrentUser ? "bg-green-500/10" : "bg-black/20"
            }`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="text-lg font-bold text-zinc-500">#{investor.rank}</span>
              <div className="min-w-0">
                <p className="truncate font-medium">{investor.name}</p>
                <p className="text-sm text-zinc-400">{formatCurrency(investor.portfolioValue)}</p>
              </div>
            </div>
            <span className="shrink-0 text-sm font-medium text-green-400">
              {formatPercent(investor.returns)}
            </span>
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="py-3 text-left">Rank</th>
              <th className="py-3 text-left">Investor</th>
              <th className="py-3 text-left">Portfolio Value</th>
              <th className="py-3 text-left">Returns</th>
            </tr>
          </thead>
          <tbody>
            {investors.map((investor) => (
              <tr
                key={investor.rank}
                className={`border-b border-zinc-900 ${
                  investor.isCurrentUser ? "bg-green-500/10" : ""
                }`}
              >
                <td className="py-3 font-bold">#{investor.rank}</td>
                <td className="py-3">{investor.name}</td>
                <td className="py-3">{formatCurrency(investor.portfolioValue)}</td>
                <td className="py-3 font-medium text-green-400">
                  {formatPercent(investor.returns)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
