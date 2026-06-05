import { formatCurrency, formatPercent } from "@/lib/format";

export type ContestRow = {
  rank: number;
  name: string;
  portfolioValue: number;
  returns: number;
  isCurrentUser?: boolean;
};

export default function ContestLeaderboardTable({
  title,
  rows,
}: {
  title: string;
  rows: ContestRow[];
}) {
  return (
    <div className="card-panel">
      <h2 className="mb-4 text-xl font-semibold sm:mb-6 sm:text-2xl">{title}</h2>

      <div className="space-y-2 md:hidden">
        {rows.map((r) => (
          <div
            key={r.rank}
            className={`flex items-center justify-between rounded-2xl border border-white/5 p-4 ${
              r.isCurrentUser ? "bg-green-500/10" : "bg-black/20"
            }`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="text-lg font-bold text-zinc-500">#{r.rank}</span>
              <div className="min-w-0">
                <p className="truncate font-medium">{r.name}</p>
                <p className="text-sm text-zinc-400">{formatCurrency(r.portfolioValue)}</p>
              </div>
            </div>
            <span className="shrink-0 text-sm font-medium text-green-400">
              {formatPercent(r.returns)}
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
            {rows.map((r) => (
              <tr
                key={r.rank}
                className={`border-b border-zinc-900 ${r.isCurrentUser ? "bg-green-500/10" : ""}`}
              >
                <td className="py-3 font-bold">#{r.rank}</td>
                <td className="py-3">{r.name}</td>
                <td className="py-3">{formatCurrency(r.portfolioValue)}</td>
                <td className="py-3 font-medium text-green-400">{formatPercent(r.returns)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
