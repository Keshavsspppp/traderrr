"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  Brain,
  Lightbulb,
  Loader2,
  PieChart,
  RefreshCw,
  Shield,
  Sparkles,
} from "lucide-react";
import type { AIInsight } from "@/types/ai-insight";

type MentorResponse = AIInsight & { generatedAt?: string };

const priorityColor = {
  HIGH: "text-red-400 bg-red-500/10",
  MEDIUM: "text-amber-400 bg-amber-500/10",
  LOW: "text-green-400 bg-green-500/10",
};

function GeneratedAt({ iso }: { iso: string }) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    setLabel(new Date(iso).toLocaleTimeString("en-IN"));
  }, [iso]);

  if (!label) return null;
  return <p className="mt-3 text-[10px] text-zinc-600">Generated {label}</p>;
}

export default function AIInsightCard() {
  const [insight, setInsight] = useState<MentorResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const url = refresh ? "/api/ai/mentor?refresh=1" : "/api/ai/mentor";
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to generate AI insight");
      }

      setInsight(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-green-500/20 bg-gradient-to-b from-green-500/10 to-transparent p-4 sm:rounded-3xl sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="rounded-xl bg-green-500/20 p-2 text-green-400">
            <Brain size={20} className="sm:h-[22px] sm:w-[22px]" />
          </div>
          <h2 className="text-lg font-semibold sm:text-xl">AI Portfolio Mentor</h2>
        </div>
        <div className="flex items-center gap-2">
          {insight?.source && insight.source !== "rules" && (
            <span className="flex items-center gap-1 rounded-full bg-green-500/15 px-2.5 py-1 text-xs capitalize text-green-400">
              <Sparkles size={12} />
              {insight.source}
            </span>
          )}
          <button
            type="button"
            onClick={() => load(true)}
            disabled={loading || refreshing}
            className="rounded-lg border border-white/10 bg-white/5 p-2 text-zinc-400 hover:bg-white/10 hover:text-white disabled:opacity-50"
            aria-label="Refresh AI analysis"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : undefined}
            />
          </button>
        </div>
      </div>

      {loading && !insight && (
        <div className="mt-8 flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <Loader2 size={28} className="animate-spin text-green-400" />
          <p className="text-sm text-zinc-400">
            Analyzing your portfolio with AI…
          </p>
          <p className="text-xs text-zinc-600">
            Holdings, sectors, and recent trades are sent to your configured LLM.
          </p>
        </div>
      )}

      {error && !insight && (
        <div className="mt-6 flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">
          <p className="text-sm text-red-300">{error}</p>
          <button
            type="button"
            onClick={() => load(true)}
            className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-black hover:bg-green-400"
          >
            Retry analysis
          </button>
        </div>
      )}

      {insight && (
        <>
          {insight.source === "rules" && (
            <p className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
              No LLM API key configured — showing basic rule-based tips. Add{" "}
              <code className="text-amber-100">GROQ_API_KEY</code> to{" "}
              <code className="text-amber-100">.env.local</code> for real AI analysis.
            </p>
          )}

          <p className="mt-5 text-sm leading-relaxed text-zinc-300">
            {insight.summary}
          </p>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-black/25 px-4 py-3">
              <span className="flex items-center gap-2 text-sm text-zinc-400">
                <Shield size={16} className="text-green-400" />
                Health Score
              </span>
              <span className="font-semibold text-green-400">
                {insight.healthScore}/100
              </span>
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
              <span className="font-semibold">
                {insight.diversificationScore}/100
              </span>
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
              className="h-full rounded-full bg-green-500 transition-all duration-500"
              style={{ width: `${insight.healthScore}%` }}
            />
          </div>

          {insight.generatedAt && insight.source !== "rules" && (
            <GeneratedAt iso={insight.generatedAt} />
          )}
        </>
      )}
    </div>
  );
}
