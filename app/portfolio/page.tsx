import DashboardLayout from "@/components/layout/DashboardLayout";
import PerformanceCard from "@/components/portfolio/PerformanceCard";
import AllocationChart from "@/components/portfolio/AllocationChart";
import HoldingsTable from "@/components/portfolio/HoldingsTable";

export default function PortfolioPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">
            Portfolio
          </h1>

          <p className="mt-2 text-zinc-400">
            Track holdings, allocation, and portfolio performance.
          </p>
        </div>

        <PerformanceCard />

        <div className="grid gap-6 lg:grid-cols-3">
          <AllocationChart />

          <div className="lg:col-span-2">
            <HoldingsTable />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}