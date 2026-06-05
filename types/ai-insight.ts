export type AIInsight = {
  healthScore: number;
  riskLevel: string;
  diversificationScore: number;
  summary: string;
  recommendations: AIRecommendation[];
  source: "rules" | "groq" | "gemini" | "anthropic" | "openai";
};

export type AIRecommendation = {
  priority: "LOW" | "MEDIUM" | "HIGH";
  title: string;
  message: string;
};
