const investors = [
  {
    rank: 1,
    name: "Rahul Sharma",
    portfolio: "₹1,42,600",
    returns: "+42.6%",
  },
  {
    rank: 2,
    name: "Priya Patel",
    portfolio: "₹1,38,200",
    returns: "+38.2%",
  },
  {
    rank: 3,
    name: "Aman Verma",
    portfolio: "₹1,35,400",
    returns: "+35.4%",
  },
  {
    rank: 4,
    name: "Keshav Prasad",
    portfolio: "₹1,24,560",
    returns: "+24.5%",
  },
  {
    rank: 5,
    name: "Rohan Gupta",
    portfolio: "₹1,22,100",
    returns: "+22.1%",
  },
];

export default function LeaderboardTable() {
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
        <h2 className="text-2xl font-semibold">
          Global Rankings
        </h2>

        <select
          className="
            rounded-xl
            border
            border-white/10
            bg-black/20
            px-4
            py-2
            outline-none
          "
        >
          <option>All Time</option>
          <option>This Month</option>
          <option>This Week</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="py-4 text-left">
                Rank
              </th>

              <th className="py-4 text-left">
                Investor
              </th>

              <th className="py-4 text-left">
                Portfolio Value
              </th>

              <th className="py-4 text-left">
                Returns
              </th>
            </tr>
          </thead>

          <tbody>
            {investors.map((investor) => (
              <tr
                key={investor.rank}
                className={`
                  border-b border-zinc-900

                  ${
                    investor.name ===
                    "Keshav Prasad"
                      ? "bg-green-500/10"
                      : ""
                  }
                `}
              >
                <td className="py-4 font-bold">
                  #{investor.rank}
                </td>

                <td className="py-4">
                  {investor.name}
                </td>

                <td className="py-4">
                  {investor.portfolio}
                </td>

                <td className="py-4 text-green-400 font-medium">
                  {investor.returns}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}