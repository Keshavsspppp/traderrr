export const INVESTOR_LEVELS = [
  "Beginner Investor",
  "Retail Investor",
  "Smart Investor",
  "Portfolio Manager",
  "Hedge Fund Manager",
  "Market Wizard",
];

export const INITIAL_VIRTUAL_CASH = 1_000_000;

export const LEVEL_XP_THRESHOLDS = [0, 1000, 5000, 15000, 50000, 150000];

export const ACHIEVEMENT_DEFS = {
  first_trade: {
    id: "first_trade",
    title: "First Trade",
    description: "Complete your first trade",
    xpReward: 100,
  },
  trades_10: {
    id: "trades_10",
    title: "10 Trades Completed",
    description: "Complete 10 trades",
    xpReward: 500,
  },
  top_100: {
    id: "top_100",
    title: "Top 100 Investor",
    description: "Reach top 100 on the leaderboard",
    xpReward: 1000,
  },
  growth_20: {
    id: "growth_20",
    title: "Portfolio Growth 20%",
    description: "Achieve 20% portfolio growth",
    xpReward: 1000,
  },
} as const;
