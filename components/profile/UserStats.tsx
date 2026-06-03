import { Trophy, Wallet, TrendingUp } from "lucide-react";

export default function UserStats() {
  return (
    <div
      className="
      rounded-3xl
      border
      border-white/10
      bg-white/5
      p-8
      backdrop-blur-xl
    "
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
        <div
          className="
          flex
          h-28
          w-28
          items-center
          justify-center
          rounded-full
          bg-green-500
          text-4xl
          font-bold
          text-black
        "
        >
          K
        </div>

        <div className="flex-1">
          <h2 className="text-3xl font-bold">
            Keshav Prasad
          </h2>

          <p className="mt-2 text-zinc-400">
            Smart Investor • Level 5
          </p>

          <div className="mt-6">
            <div className="mb-2 flex justify-between">
              <span>XP Progress</span>
              <span>780 / 1000</span>
            </div>

            <div className="h-3 rounded-full bg-zinc-800">
              <div
                className="h-3 rounded-full bg-green-500"
                style={{ width: "78%" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-black/20 p-4">
          <Wallet className="mb-2 text-green-400" />
          <p className="text-zinc-400">Portfolio Value</p>
          <h3 className="mt-2 text-2xl font-bold">
            ₹1,24,560
          </h3>
        </div>

        <div className="rounded-2xl bg-black/20 p-4">
          <TrendingUp className="mb-2 text-green-400" />
          <p className="text-zinc-400">Total Return</p>
          <h3 className="mt-2 text-2xl font-bold text-green-400">
            +24.56%
          </h3>
        </div>

        <div className="rounded-2xl bg-black/20 p-4">
          <Trophy className="mb-2 text-green-400" />
          <p className="text-zinc-400">Leaderboard Rank</p>
          <h3 className="mt-2 text-2xl font-bold">
            #42
          </h3>
        </div>
      </div>
    </div>
  );
}