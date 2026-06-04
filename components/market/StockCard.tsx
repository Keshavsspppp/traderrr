interface StockCardProps {
  symbol: string;
  price: string;
  change: string;
}

export default function StockCard({ symbol, price, change }: StockCardProps) {
  const positive = change.startsWith("+");
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <p className="text-sm text-zinc-400">{symbol}</p>
      <p className="mt-2 text-2xl font-bold">{price}</p>
      <p className={`mt-1 text-sm font-medium ${positive ? "text-green-400" : "text-red-400"}`}>
        {change}
      </p>
    </div>
  );
}
