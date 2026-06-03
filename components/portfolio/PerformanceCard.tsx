import {
  Wallet,
  TrendingUp,
  IndianRupee,
  BarChart3,
} from "lucide-react";

const stats = [
  {
    title: "Portfolio Value",
    value: "₹1,24,560",
    icon: Wallet,
  },
  {
    title: "Invested Amount",
    value: "₹1,00,000",
    icon: IndianRupee,
  },
  {
    title: "Total Profit",
    value: "+₹24,560",
    icon: TrendingUp,
  },
  {
    title: "Return",
    value: "+24.56%",
    icon: BarChart3,
  },
];

export default function PerformanceCard() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="
            rounded-3xl
            border
            border-white/10
            bg-white/5
            p-6
            backdrop-blur-xl
          "
        >
          <div className="flex items-center justify-between">
            <p className="text-zinc-400">
              {stat.title}
            </p>

            <stat.icon
              size={22}
              className="text-green-400"
            />
          </div>

          <h3 className="mt-4 text-3xl font-bold">
            {stat.value}
          </h3>
        </div>
      ))}
    </div>
  );
}