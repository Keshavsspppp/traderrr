"use client";

const stocks = [
  {
    symbol: "RELIANCE",
    price: "₹2,845",
    change: "+2.4%",
  },
  {
    symbol: "TCS",
    price: "₹4,120",
    change: "+1.2%",
  },
  {
    symbol: "INFY",
    price: "₹1,785",
    change: "-0.8%",
  },
  {
    symbol: "HDFCBANK",
    price: "₹1,920",
    change: "+3.1%",
  },
];

export default function StockTable() {
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
        Market Overview
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="py-4 text-left">
                Symbol
              </th>

              <th className="py-4 text-left">
                Price
              </th>

              <th className="py-4 text-left">
                Change
              </th>

              <th className="py-4 text-left">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {stocks.map((stock) => (
              <tr
                key={stock.symbol}
                className="border-b border-zinc-900"
              >
                <td className="py-4">
                  {stock.symbol}
                </td>

                <td className="py-4">
                  {stock.price}
                </td>

                <td
                  className={`py-4 ${
                    stock.change.startsWith("+")
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {stock.change}
                </td>

                <td className="py-4">
                  <button
                    className="
                      rounded-xl
                      bg-green-500
                      px-4
                      py-2
                      text-black
                      font-medium
                    "
                  >
                    Trade
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}