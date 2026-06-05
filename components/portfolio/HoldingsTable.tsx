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
    <div className="card-panel">
      <h2 className="mb-4 text-lg font-semibold sm:mb-6 sm:text-xl">Holdings</h2>
      {holdings.length === 0 ? (
        <p className="text-sm text-zinc-400 sm:text-base">
          No holdings yet. Buy stocks from the market.
        </p>
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {holdings.map((h) => (
              <div
                key={h.stockSymbol}
                className="rounded-2xl border border-white/5 bg-black/20 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{h.stockSymbol}</p>
                    <p className="text-sm text-zinc-500">{h.companyName}</p>
                  </div>
                  <p
                    className={`text-right text-sm font-medium ${
                      h.pnl >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {formatCurrency(h.pnl)}
                    <span className="block text-xs">({formatPercent(h.pnlPercent)})</span>
                  </p>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-zinc-400">
                  <div>
                    <p>Qty</p>
                    <p className="font-medium text-white">{h.quantity}</p>
                  </div>
                  <div>
                    <p>Avg</p>
                    <p className="font-medium text-white">{formatCurrency(h.avgBuyPrice)}</p>
                  </div>
                  <div>
                    <p>Now</p>
                    <p className="font-medium text-white">{formatCurrency(h.currentPrice)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="py-3 text-left">Stock</th>
                  <th className="py-3 text-left">Qty</th>
                  <th className="py-3 text-left">Avg Price</th>
                  <th className="py-3 text-left">Current</th>
                  <th className="py-3 text-left">P&L</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => (
                  <tr key={h.stockSymbol} className="border-b border-zinc-900">
                    <td className="py-3">
                      <p className="font-medium">{h.stockSymbol}</p>
                      <p className="text-xs text-zinc-500">{h.companyName}</p>
                    </td>
                    <td className="py-3">{h.quantity}</td>
                    <td className="py-3">{formatCurrency(h.avgBuyPrice)}</td>
                    <td className="py-3">{formatCurrency(h.currentPrice)}</td>
                    <td
                      className={`py-3 font-medium ${
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
        </>
      )}
    </div>
  );
}
