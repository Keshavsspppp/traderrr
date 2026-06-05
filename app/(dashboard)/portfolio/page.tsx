import PerformanceCard from "@/components/portfolio/PerformanceCard";
import AllocationChart from "@/components/portfolio/AllocationChart";
import HoldingsTable from "@/components/portfolio/HoldingsTable";
import PendingOrdersPanel from "@/components/portfolio/PendingOrdersPanel";
import PageHeader from "@/components/ui/PageHeader";
import { connectDB } from "@/lib/mongodb";
import { requireUser } from "@/lib/api-auth";
import {
  getHoldingsForUser,
  getAllocationBySector,
  getRoiPercent,
  computePortfolioValue,
} from "@/services/portfolio.service";
import { INITIAL_VIRTUAL_CASH } from "@/lib/constants";

export default async function PortfolioPage() {
  await connectDB();
  const user = await requireUser();
  const userId = user._id.toString();
  const holdings = await getHoldingsForUser(userId);
  const totalValue = await computePortfolioValue(user);
  const invested = holdings.reduce((s, h) => s + h.invested, 0);
  const allocation = getAllocationBySector(holdings);

  const performance = {
    portfolioValue: totalValue,
    investedAmount: invested || INITIAL_VIRTUAL_CASH - user.cashBalance,
    totalProfit: totalValue - INITIAL_VIRTUAL_CASH,
    roi: getRoiPercent(totalValue),
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Portfolio"
        description="Holdings, sector allocation, and performance metrics for your virtual investments."
      />
      <PerformanceCard performance={performance} />
      <PendingOrdersPanel />
      <div className="grid gap-6 lg:grid-cols-3">
        <AllocationChart allocation={allocation} />
        <div className="lg:col-span-2">
          <HoldingsTable holdings={holdings} />
        </div>
      </div>
    </div>
  );
}
