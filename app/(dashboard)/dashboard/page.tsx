import { PortfolioOverview } from "@/components/dashboard/PortfolioOverview";
import PortfolioGrowthChart from "@/components/dashboard/PortfolioGrowthChart";
import AIInsightCard from "@/components/dashboard/AIInsightCard";
import RecentTrades from "@/components/dashboard/RecentTrades";
import DashboardWatchlist from "@/components/dashboard/DashboardWatchlist";
import PendingOrdersPanel from "@/components/portfolio/PendingOrdersPanel";
import PageHeader from "@/components/ui/PageHeader";
import { getCurrentUser } from "@/lib/session";
import { connectDB } from "@/lib/mongodb";
import { getDashboardData } from "@/services/dashboard.service";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  await connectDB();
  const data = await getDashboardData(user.id);

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title={`Welcome back, ${user.name.split(" ")[0]}`}
        description="Monitor portfolio performance, AI insights, and recent trades in one place."
      />
      <PortfolioOverview
        portfolio={data.portfolio}
        globalRank={data.globalRank}
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PortfolioGrowthChart chartData={data.chartData} />
        </div>
        <AIInsightCard />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <DashboardWatchlist />
        <div className="lg:col-span-2">
          <PendingOrdersPanel />
        </div>
      </div>
      <RecentTrades trades={data.recentTrades} />
    </div>
  );
}
