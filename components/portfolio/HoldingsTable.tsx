import { formatCurrency, formatPercent } from "@/lib/format";

export type HoldingRow = {
  stockSymbol: string;
  companyName: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
};

export default function HoldingsTable({ holdings }: { holdings: HoldingRow[] }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <h2 className="mb-6 text-xl font-semibold">Holdings</h2>
      {holdings.length === 0 ? (
        <p className="text-zinc-400">No holdings yet. Buy stocks from the market.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="py-4 text-left">Stock</th>
                <th className="py-4 text-left">Qty</th>
                <th className="py-4 text-left">Avg Price</th>
                <th className="py-4 text-left">Current</th>
                <th className="py-4 text-left">P&L</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => (
                <tr key={h.stockSymbol} className="border-b border-zinc-900">
                  <td className="py-4">
                    <p className="font-medium">{h.stockSymbol}</p>
                    <p className="text-xs text-zinc-500">{h.companyName}</p>
                  </td>
                  <td className="py-4">{h.quantity}</td>
                  <td className="py-4">{formatCurrency(h.avgBuyPrice)}</td>
                  <td className="py-4">{formatCurrency(h.currentPrice)}</td>
                  <td
                    className={`py-4 font-medium ${
                      h.pnl >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {formatCurrency(h.pnl)} ({formatPercent(h.pnlPercent)})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
