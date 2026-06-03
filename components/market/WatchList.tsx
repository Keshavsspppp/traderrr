const watchlist = [
  "RELIANCE",
  "TCS",
  "INFY",
  "HDFCBANK",
  "SBIN",
];

export default function WatchList() {
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
      <h2 className="mb-6 text-xl font-semibold">
        Watchlist
      </h2>

      <div className="space-y-3">
        {watchlist.map((stock) => (
          <div
            key={stock}
            className="
              rounded-xl
              bg-black/20
              p-4
            "
          >
            {stock}
          </div>
        ))}
      </div>
    </div>
  );
}