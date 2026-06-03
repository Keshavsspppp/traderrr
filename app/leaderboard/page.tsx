import DashboardLayout from "@/components/layout/DashboardLayout";
import TopInvestors from "@/components/leaderboard/TopInvestors";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";

export default function LeaderboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">
            Leaderboard
          </h1>

          <p className="mt-2 text-zinc-400">
            Compete with investors and climb the rankings.
          </p>
        </div>

        <TopInvestors />

        <LeaderboardTable />
      </div>
    </DashboardLayout>
  );
}