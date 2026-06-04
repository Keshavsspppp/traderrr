"use client";

import { motion } from "framer-motion";
import { DollarSign, Percent, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import type { PortfolioData } from "@/types/portfolio";
import { formatCurrency, formatPercent } from "@/lib/format";

interface PortfolioOverviewProps {
  portfolio: PortfolioData;
  globalRank?: number;
  isLoading?: boolean;
}

function PortfolioSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-36 animate-pulse rounded-3xl border border-white/10 bg-white/5"
        />
      ))}
    </div>
  );
}

export function PortfolioOverview({
  portfolio,
  globalRank,
  isLoading,
}: PortfolioOverviewProps) {
  const metrics = [
    {
      label: "Portfolio Value",
      value: formatCurrency(portfolio.totalValue),
      change: portfolio.dailyChange,
      icon: Wallet,
      positive: portfolio.dailyChange >= 0,
      showChange: true,
    },
    {
      label: "Cash Balance",
      value: formatCurrency(portfolio.cashBalance),
      icon: DollarSign,
      positive: true,
      showChange: false,
    },
    {
      label: "Today's P&L",
      value: formatCurrency(portfolio.dailyPnL),
      change: portfolio.dailyPnLPercent,
      icon: TrendingUp,
      positive: portfolio.dailyPnL >= 0,
      showChange: true,
    },
    {
      label: globalRank ? "Global Rank" : "Total Return",
      value: globalRank ? `#${globalRank}` : formatCurrency(portfolio.totalReturn),
      change: globalRank ? undefined : portfolio.roi,
      icon: Percent,
      positive: portfolio.totalReturn >= 0,
      showChange: !globalRank,
    },
  ];

  if (isLoading) return <PortfolioSkeleton />;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08 }}
          className="card-hover rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-zinc-400">{metric.label}</p>
              <p className="mt-2 text-2xl font-bold sm:text-3xl">{metric.value}</p>
            </div>
            <div className="rounded-2xl bg-green-500/10 p-3 text-green-400">
              <metric.icon size={22} />
            </div>
          </div>
          {metric.showChange && metric.change !== undefined && (
            <div
              className={`mt-4 flex items-center text-sm font-medium ${
                metric.positive ? "text-green-400" : "text-red-400"
              }`}
            >
              {metric.positive ? (
                <TrendingUp className="mr-1 h-4 w-4" />
              ) : (
                <TrendingDown className="mr-1 h-4 w-4" />
              )}
              <span>{formatPercent(metric.change)}</span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
