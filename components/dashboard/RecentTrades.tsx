import { formatCurrency } from "@/lib/format";

export type TradeRow = {
  stock: string;
  type: string;
  quantity: number;
  price: number;
  date: string | Date;
};

function formatDate(date: string | Date) {
  const d = new Date(date);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) return "Today";
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

export default function RecentTrades({ trades }: { trades: TradeRow[] }) {
  return (
    <div className="card-panel">
      <h2 className="mb-4 text-lg font-semibold sm:mb-6 sm:text-xl">Recent Trades</h2>
      {trades.length === 0 ? (
        <p className="text-sm text-zinc-400 sm:text-base">
          No trades yet. Visit the market to start trading.
        </p>
      ) : (
        <>
          <div className="space-y-2 md:hidden">
            {trades.map((trade, index) => (
              <div
                key={`${trade.stock}-${index}`}
                className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/20 p-3"
              >
                <div>
                  <p className="font-medium">{trade.stock}</p>
                  <p className="text-xs text-zinc-500">{formatDate(trade.date)}</p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-medium ${
                      trade.type === "BUY" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {trade.type} × {trade.quantity}
                  </p>
                  <p className="text-sm text-zinc-400">{formatCurrency(trade.price)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="py-3 text-left">Stock</th>
                  <th className="py-3 text-left">Type</th>
                  <th className="py-3 text-left">Quantity</th>
                  <th className="py-3 text-left">Price</th>
                  <th className="py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade, index) => (
                  <tr key={`${trade.stock}-${index}`} className="border-b border-zinc-900">
                    <td className="py-3">{trade.stock}</td>
                    <td
                      className={`py-3 font-medium ${
                        trade.type === "BUY" ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {trade.type}
                    </td>
                    <td className="py-3">{trade.quantity}</td>
                    <td className="py-3">{formatCurrency(trade.price)}</td>
                    <td className="py-3 text-zinc-400">{formatDate(trade.date)}</td>
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
