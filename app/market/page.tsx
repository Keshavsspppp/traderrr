import DashboardLayout from "@/components/layout/DashboardLayout";
import StockSearch from "@/components/market/StockSearch";
import StockCard from "@/components/market/StockCard";
import StockTable from "@/components/market/StockTable";
import WatchList from "@/components/market/WatchList";

export default function MarketPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">
            Market
          </h1>

          <p className="mt-2 text-zinc-400">
            Track stocks, monitor trends and execute trades.
          </p>
        </div>

        <StockSearch />

        <div className="grid gap-6 lg:grid-cols-4">
          <StockCard
            symbol="RELIANCE"
            price="₹2,845"
            change="+2.4%"
          />

          <StockCard
            symbol="TCS"
            price="₹4,120"
            change="+1.2%"
          />

          <StockCard
            symbol="INFY"
            price="₹1,785"
            change="-0.8%"
          />

          <StockCard
            symbol="HDFCBANK"
            price="₹1,920"
            change="+3.1%"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <StockTable />
          </div>

          <WatchList />
        </div>
      </div>
    </DashboardLayout>
  );
}