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
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recent Trades</h2>
      </div>
      {trades.length === 0 ? (
        <p className="text-zinc-400">No trades yet. Visit the market to start trading.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="py-4 text-left">Stock</th>
                <th className="py-4 text-left">Type</th>
                <th className="py-4 text-left">Quantity</th>
                <th className="py-4 text-left">Price</th>
                <th className="py-4 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade, index) => (
                <tr key={`${trade.stock}-${index}`} className="border-b border-zinc-900">
                  <td className="py-4">{trade.stock}</td>
                  <td
                    className={`py-4 font-medium ${
                      trade.type === "BUY" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {trade.type}
                  </td>
                  <td className="py-4">{trade.quantity}</td>
                  <td className="py-4">{formatCurrency(trade.price)}</td>
                  <td className="py-4 text-zinc-400">{formatDate(trade.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
