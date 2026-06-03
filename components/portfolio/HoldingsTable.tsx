const holdings = [
  {
    stock: "RELIANCE",
    qty: 15,
    avgPrice: "₹2,600",
    currentPrice: "₹2,845",
    pnl: "+₹3,675",
  },
  {
    stock: "TCS",
    qty: 10,
    avgPrice: "₹3,800",
    currentPrice: "₹4,120",
    pnl: "+₹3,200",
  },
  {
    stock: "INFY",
    qty: 20,
    avgPrice: "₹1,700",
    currentPrice: "₹1,785",
    pnl: "+₹1,700",
  },
  {
    stock: "HDFCBANK",
    qty: 25,
    avgPrice: "₹1,820",
    currentPrice: "₹1,920",
    pnl: "+₹2,500",
  },
];

export default function HoldingsTable() {
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
          Holdings
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
                Qty
              </th>

              <th className="py-4 text-left">
                Avg Price
              </th>

              <th className="py-4 text-left">
                Current
              </th>

              <th className="py-4 text-left">
                P&L
              </th>
            </tr>
          </thead>

          <tbody>
            {holdings.map((holding) => (
              <tr
                key={holding.stock}
                className="border-b border-zinc-900"
              >
                <td className="py-4 font-medium">
                  {holding.stock}
                </td>

                <td className="py-4">
                  {holding.qty}
                </td>

                <td className="py-4">
                  {holding.avgPrice}
                </td>

                <td className="py-4">
                  {holding.currentPrice}
                </td>

                <td className="py-4 text-green-400">
                  {holding.pnl}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}