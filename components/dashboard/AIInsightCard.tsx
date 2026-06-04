import { AlertTriangle, Brain, PieChart, Shield } from "lucide-react";

export type AIInsight = {
  healthScore: number;
  riskLevel: string;
  diversificationScore: number;
  summary: string;
};

export default function AIInsightCard({ insight }: { insight: AIInsight }) {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-green-500/20 bg-gradient-to-b from-green-500/10 to-transparent p-6">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-green-500/20 p-2 text-green-400">
          <Brain size={22} />
        </div>
        <h2 className="text-xl font-semibold">AI Portfolio Mentor</h2>
      </div>
      <p className="mt-5 text-sm leading-relaxed text-zinc-300">{insight.summary}</p>
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between rounded-xl bg-black/25 px-4 py-3">
          <span className="flex items-center gap-2 text-sm text-zinc-400">
            <Shield size={16} className="text-green-400" />
            Health Score
          </span>
          <span className="font-semibold text-green-400">{insight.healthScore}/100</span>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-black/25 px-4 py-3">
          <span className="flex items-center gap-2 text-sm text-zinc-400">
            <AlertTriangle size={16} className="text-amber-400" />
            Risk Level
          </span>
          <span className="font-medium text-amber-300">{insight.riskLevel}</span>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-black/25 px-4 py-3">
          <span className="flex items-center gap-2 text-sm text-zinc-400">
            <PieChart size={16} className="text-green-400" />
            Diversification
          </span>
          <span className="font-semibold">{insight.diversificationScore}/100</span>
        </div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-green-500"
          style={{ width: `${insight.healthScore}%` }}
        />
      </div>
    </div>
  );
}
