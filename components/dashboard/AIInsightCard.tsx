import { Brain } from "lucide-react";

export default function AIInsightCard() {
  return (
    <div
      className="
      rounded-3xl
      border
      border-green-500/20
      bg-green-500/10
      p-6
    "
    >
      <div className="flex items-center gap-3">
        <Brain
          size={24}
          className="text-green-400"
        />

        <h2 className="text-xl font-semibold">
          AI Portfolio Insight
        </h2>
      </div>

      <p className="mt-6 text-zinc-300 leading-relaxed">
        Your portfolio is currently concentrated
        in Technology stocks.
      </p>

      <p className="mt-3 text-zinc-400">
        Consider increasing exposure to Banking,
        FMCG, and Energy sectors to improve
        diversification and reduce overall risk.
      </p>

      <div className="mt-6 rounded-xl bg-black/20 p-4">
        <p className="text-green-400">
          Diversification Score: 68 / 100
        </p>
      </div>
    </div>
  );
}