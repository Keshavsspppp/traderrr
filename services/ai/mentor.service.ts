import Transaction from "@/models/Transaction";
import type { IUser } from "@/models/User";
import { callLlm, isLlmConfigured } from "@/lib/ai/llm";
import { INITIAL_VIRTUAL_CASH } from "@/lib/constants";
import {
  getAllocationBySector,
  getHoldingsForUser,
  getRoiPercent,
  getSectorConcentration,
  computePortfolioValue,
} from "@/services/portfolio.service";
import type { AIInsight, AIRecommendation } from "@/types/ai-insight";

const SYSTEM_PROMPT = `You are InvestArena's AI Portfolio Mentor — a concise, encouraging financial educator for Indian virtual stock traders.
Analyze the user's portfolio data and respond ONLY with valid JSON (no markdown fences) matching this schema:
{
  "healthScore": number 0-100,
  "riskLevel": "Low" | "Moderate" | "High",
  "diversificationScore": number 0-100,
  "summary": "2-3 sentence personalized overview",
  "recommendations": [
    { "priority": "LOW"|"MEDIUM"|"HIGH", "title": "short title", "message": "actionable advice" }
  ]
}
Give 2-4 recommendations. Reference specific holdings/sectors when possible. This is virtual money for learning — be educational, not alarmist.`;

function ruleBasedInsight(
  holdings: Awaited<ReturnType<typeof getHoldingsForUser>>,
  allocation: { name: string; value: number }[],
  concentration: number,
  topSector: string,
  roi: number,
  cashRatio: number
): AIInsight {
  const healthScore = Math.min(
    100,
    Math.round(
      (allocation.length >= 3 ? 30 : allocation.length * 10) +
        (concentration < 0.5 ? 30 : 10) +
        (roi > 0 ? 25 : 10) +
        (cashRatio < 0.3 ? 15 : 5)
    )
  );

  const recommendations: AIRecommendation[] = [];

  if (holdings.length === 0) {
    return {
      healthScore: 40,
      riskLevel: "Low",
      diversificationScore: 0,
      summary:
        "Your portfolio is all cash. Start with 3–5 stocks across different sectors to build a balanced virtual portfolio.",
      recommendations: [
        {
          priority: "HIGH",
          title: "Start investing",
          message:
            "Pick large-cap names like RELIANCE, TCS, or HDFCBANK to begin learning with lower volatility.",
        },
      ],
      source: "rules",
    };
  }

  if (concentration > 0.5) {
    recommendations.push({
      priority: "HIGH",
      title: "Reduce sector concentration",
      message: `${Math.round(concentration * 100)}% of your holdings are in ${topSector}. Add positions in Banking, FMCG, or Energy.`,
    });
  }

  if (cashRatio > 0.4) {
    recommendations.push({
      priority: "MEDIUM",
      title: "Deploy idle cash",
      message: `You have ${Math.round(cashRatio * 100)}% in cash. Consider gradual entries into diversified stocks.`,
    });
  }

  if (roi < -5) {
    recommendations.push({
      priority: "HIGH",
      title: "Review losing positions",
      message:
        "Portfolio is down more than 5%. Review whether losses are temporary or if rebalancing into stronger sectors helps.",
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      priority: "LOW",
      title: "Stay the course",
      message:
        "Your allocation looks reasonable. Keep monitoring sector weights and avoid over-trading.",
    });
  }

  return {
    healthScore,
    riskLevel:
      concentration > 0.6 ? "High" : concentration > 0.4 ? "Moderate" : "Low",
    diversificationScore: Math.min(
      100,
      Math.round((1 - concentration) * 100 + allocation.length * 5)
    ),
    summary: `Your portfolio has ${Math.round(concentration * 100)}% exposure to ${topSector}. ${roi >= 0 ? `You're up ${roi.toFixed(1)}% overall.` : `You're down ${Math.abs(roi).toFixed(1)}% — review your largest positions.`}`,
    recommendations,
    source: "rules",
  };
}

function parseLlmInsight(
  raw: string,
  provider: AIInsight["source"]
): AIInsight | null {
  try {
    const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(cleaned) as Partial<AIInsight>;
    if (
      typeof parsed.healthScore !== "number" ||
      typeof parsed.summary !== "string"
    ) {
      return null;
    }
    return {
      healthScore: Math.min(100, Math.max(0, Math.round(parsed.healthScore))),
      riskLevel: parsed.riskLevel ?? "Moderate",
      diversificationScore: Math.min(
        100,
        Math.max(0, Math.round(parsed.diversificationScore ?? 50))
      ),
      summary: parsed.summary,
      recommendations: Array.isArray(parsed.recommendations)
        ? parsed.recommendations.slice(0, 4).map((r) => ({
            priority: r.priority ?? "MEDIUM",
            title: r.title ?? "Tip",
            message: r.message ?? "",
          }))
        : [],
      source: provider,
    };
  } catch {
    return null;
  }
}

export async function generatePortfolioInsight(
  user: IUser
): Promise<AIInsight> {
  const userId = user._id.toString();
  const holdings = await getHoldingsForUser(userId);
  const totalValue = await computePortfolioValue(user);
  const roi = getRoiPercent(totalValue);
  const allocation = getAllocationBySector(holdings);
  const { topSector, concentration } = getSectorConcentration(allocation);
  const cashRatio = totalValue > 0 ? user.cashBalance / totalValue : 1;

  const fallback = ruleBasedInsight(
    holdings,
    allocation,
    concentration,
    topSector,
    roi,
    cashRatio
  );

  if (!isLlmConfigured()) {
    return fallback;
  }

  const recentTrades = await Transaction.find({ userId: user._id })
    .sort({ createdAt: -1 })
    .limit(15)
    .select("stockSymbol type quantity price createdAt");

  const userPrompt = JSON.stringify(
    {
      investor: {
        name: user.name,
        level: user.level,
        cashBalance: user.cashBalance,
        totalPortfolioValue: totalValue,
        roiPercent: Math.round(roi * 100) / 100,
        startingCapital: INITIAL_VIRTUAL_CASH,
      },
      holdings: holdings.map((h) => ({
        symbol: h.stockSymbol,
        company: h.companyName,
        sector: h.sector,
        quantity: h.quantity,
        avgBuyPrice: h.avgBuyPrice,
        currentPrice: h.currentPrice,
        pnlPercent: Math.round(h.pnlPercent * 100) / 100,
        weightPercent:
          totalValue > 0
            ? Math.round((h.currentValue / totalValue) * 1000) / 10
            : 0,
      })),
      sectorAllocation: allocation,
      topSector,
      sectorConcentrationPercent: Math.round(concentration * 100),
      recentTrades: recentTrades.map((t) => ({
        symbol: t.stockSymbol,
        type: t.type,
        quantity: t.quantity,
        price: t.price,
        date: t.createdAt,
      })),
    },
    null,
    2
  );

  const result = await callLlm(SYSTEM_PROMPT, userPrompt);
  if (!result) return fallback;

  return parseLlmInsight(result.content, result.provider) ?? fallback;
}
