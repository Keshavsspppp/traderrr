import DashboardLayout from "@/components/layout/DashboardLayout";
import PortfolioStats from "@/components/dashboard/PortfolioStats";
import PortfolioGrowthChart from "@/components/dashboard/PortfolioGrowthChart";
import AIInsightCard from "@/components/dashboard/AIInsightCard";
import RecentTrades from "@/components/dashboard/RecentTrades";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">
            Welcome Back, Keshav 👋
          </h1>

          <p className="mt-2 text-zinc-400">
            Monitor your investments, portfolio performance,
            and AI insights in one place.
          </p>
        </div>

        {/* Stats */}
        <PortfolioStats />

        {/* Chart + AI */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PortfolioGrowthChart />
          </div>

          <AIInsightCard />
        </div>

        {/* Trades */}
        <RecentTrades />
      </div>
    </DashboardLayout>
  );
}