import { AlertTriangle, Brain, Lightbulb, PieChart, Shield, Sparkles } from "lucide-react";
import type { AIInsight } from "@/types/ai-insight";

export default function AIInsightCard({ insight }: { insight: AIInsight }) {
  const priorityColor = {
    HIGH: "text-red-400 bg-red-500/10",
    MEDIUM: "text-amber-400 bg-amber-500/10",
    LOW: "text-green-400 bg-green-500/10",
  };

  return (
    <div className="flex h-full flex-col rounded-3xl border border-green-500/20 bg-gradient-to-b from-green-500/10 to-transparent p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-green-500/20 p-2 text-green-400">
            <Brain size={22} />
          </div>
          <h2 className="text-xl font-semibold">AI Portfolio Mentor</h2>
        </div>
        {insight.source !== "rules" && (
          <span className="flex items-center gap-1 rounded-full bg-green-500/15 px-2.5 py-1 text-xs capitalize text-green-400">
            <Sparkles size={12} />
            {insight.source}
          </span>
        )}
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
      {insight.recommendations.length > 0 && (
        <div className="mt-5 space-y-2">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
            <Lightbulb size={14} />
            Recommendations
          </p>
          {insight.recommendations.map((rec, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/5 bg-black/20 px-3 py-2.5"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${priorityColor[rec.priority]}`}
                >
                  {rec.priority}
                </span>
                <span className="text-sm font-medium">{rec.title}</span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                {rec.message}
              </p>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-green-500"
          style={{ width: `${insight.healthScore}%` }}
        />
      </div>
    </div>
  );
}
