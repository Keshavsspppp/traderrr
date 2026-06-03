interface StockCardProps {
  symbol: string;
  price: string;
  change: string;
}

export default function StockCard({
  symbol,
  price,
  change,
}: StockCardProps) {
  const positive = change.startsWith("+");

  return (
    <div
      className="
        rounded-3xl
        border
        border-white/10
        bg-white/5
        p-6
        backdrop-blur-xl
      "
    >
      <p className="text-zinc-400">
        {symbol}
      </p>

      <h3 className="mt-2 text-3xl font-bold">
        {price}
      </h3>

      <p
        className={`mt-3 font-medium ${
          positive
            ? "text-green-400"
            : "text-red-400"
        }`}
      >
        {change}
      </p>
    </div>
  );
}