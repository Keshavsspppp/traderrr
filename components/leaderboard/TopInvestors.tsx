import { Crown, Medal, Trophy } from "lucide-react";

const topInvestors = [
  {
    rank: 1,
    name: "Rahul Sharma",
    return: "+42.6%",
    icon: Crown,
    color: "text-yellow-400",
  },
  {
    rank: 2,
    name: "Priya Patel",
    return: "+38.2%",
    icon: Trophy,
    color: "text-zinc-300",
  },
  {
    rank: 3,
    name: "Aman Verma",
    return: "+35.4%",
    icon: Medal,
    color: "text-amber-600",
  },
];

export default function TopInvestors() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {topInvestors.map((investor) => (
        <div
          key={investor.rank}
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
            <div
              className={investor.color}
            >
              <investor.icon size={34} />
            </div>

            <span className="text-3xl font-bold">
              #{investor.rank}
            </span>
          </div>

          <h3 className="mt-6 text-xl font-semibold">
            {investor.name}
          </h3>

          <p className="mt-2 text-green-400 text-lg">
            {investor.return}
          </p>

          <p className="mt-1 text-zinc-400">
            Portfolio Return
          </p>
        </div>
      ))}
    </div>
  );
}