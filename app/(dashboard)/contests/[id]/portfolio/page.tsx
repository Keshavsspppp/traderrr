import PerformanceCard from "@/components/portfolio/PerformanceCard";
import AllocationChart from "@/components/portfolio/AllocationChart";
import HoldingsTable from "@/components/portfolio/HoldingsTable";
import PendingOrdersPanel from "@/components/portfolio/PendingOrdersPanel";
import PageHeader from "@/components/ui/PageHeader";
import { connectDB } from "@/lib/mongodb";
import { requireUser } from "@/lib/api-auth";
import ContestAccount from "@/models/ContestAccount";
import {
  computePortfolioValueFromCash,
  getAllocationBySector,
  getHoldingsForUser,
  getRoiPercentForBalance,
} from "@/services/portfolio.service";

export default async function ContestPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await connectDB();
  const user = await requireUser();
  const userId = user._id.toString();

  const account = await ContestAccount.findOne({
    contestId: id,
    userId: user._id,
    leftAt: null,
  });
  if (!account) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <PageHeader
          title="Contest Portfolio"
          description="Join this contest to view and trade with an isolated paper portfolio."
        />
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-400">
          You are not in this contest.
        </div>
      </div>
    );
  }

  const holdings = await getHoldingsForUser(userId, { contestId: id });
  const totalValue = await computePortfolioValueFromCash(userId, account.cashBalance, {
    contestId: id,
  });
  const invested = holdings.reduce((s, h) => s + h.invested, 0);
  const allocation = getAllocationBySector(holdings);

  const performance = {
    portfolioValue: totalValue,
    investedAmount: invested || account.startingBalance - account.cashBalance,
    totalProfit: totalValue - account.startingBalance,
    roi: getRoiPercentForBalance(totalValue, account.startingBalance),
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Contest Portfolio"
        description="Holdings and performance for your contest-only paper portfolio."
      />
      <PerformanceCard performance={performance} />
      <PendingOrdersPanel contestId={id} />
      <div className="grid gap-6 lg:grid-cols-3">
        <AllocationChart allocation={allocation} />
        <div className="lg:col-span-2">
          <HoldingsTable holdings={holdings} />
        </div>
      </div>
    </div>
  );
}
