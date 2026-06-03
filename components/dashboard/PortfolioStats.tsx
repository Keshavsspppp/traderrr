import {
  Wallet,
  IndianRupee,
  TrendingUp,
  Trophy,
} from "lucide-react";

const stats = [
  {
    title: "Portfolio Value",
    value: "₹1,24,560",
    change: "+12.45%",
    icon: Wallet,
  },
  {
    title: "Available Cash",
    value: "₹25,400",
    change: "+4.2%",
    icon: IndianRupee,
  },
  {
    title: "Today's Profit",
    value: "+₹2,350",
    change: "+1.87%",
    icon: TrendingUp,
  },
  {
    title: "Global Rank",
    value: "#42",
    change: "+5",
    icon: Trophy,
  },
];

export default function PortfolioStats() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <div
          key={item.title}
          className="
            group
            rounded-3xl
            border
            border-white/10
            bg-white/5
            p-6
            backdrop-blur-xl
            transition-all
            duration-300
            hover:border-green-500/30
            hover:bg-white/10
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">
                {item.title}
              </p>

              <h3 className="mt-3 text-3xl font-bold">
                {item.value}
              </h3>

              <p className="mt-2 text-sm text-green-400">
                {item.change}
              </p>
            </div>

            <div
              className="
                rounded-2xl
                bg-green-500/10
                p-4
                text-green-400
              "
            >
              <item.icon size={26} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}