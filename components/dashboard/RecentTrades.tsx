const trades = [
  {
    stock: "RELIANCE",
    type: "BUY",
    quantity: 10,
    price: "₹2,845",
    date: "Today",
  },
  {
    stock: "TCS",
    type: "SELL",
    quantity: 5,
    price: "₹4,120",
    date: "Today",
  },
  {
    stock: "INFY",
    type: "BUY",
    quantity: 12,
    price: "₹1,785",
    date: "Yesterday",
  },
];

export default function RecentTrades() {
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
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Recent Trades
        </h2>

        <button className="text-green-400">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="py-4 text-left">
                Stock
              </th>

              <th className="py-4 text-left">
                Type
              </th>

              <th className="py-4 text-left">
                Quantity
              </th>

              <th className="py-4 text-left">
                Price
              </th>

              <th className="py-4 text-left">
                Date
              </th>
            </tr>
          </thead>

          <tbody>
            {trades.map((trade, index) => (
              <tr
                key={index}
                className="border-b border-zinc-900"
              >
                <td className="py-4">
                  {trade.stock}
                </td>

                <td
                  className={`py-4 font-medium ${
                    trade.type === "BUY"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {trade.type}
                </td>

                <td className="py-4">
                  {trade.quantity}
                </td>

                <td className="py-4">
                  {trade.price}
                </td>

                <td className="py-4 text-zinc-400">
                  {trade.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}