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
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <h2 className="mb-6 text-2xl font-semibold">Global Rankings</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="py-4 text-left">Rank</th>
              <th className="py-4 text-left">Investor</th>
              <th className="py-4 text-left">Portfolio Value</th>
              <th className="py-4 text-left">Returns</th>
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
                <td className="py-4 font-bold">#{investor.rank}</td>
                <td className="py-4">{investor.name}</td>
                <td className="py-4">{formatCurrency(investor.portfolioValue)}</td>
                <td className="py-4 font-medium text-green-400">
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
