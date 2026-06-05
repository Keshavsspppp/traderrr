import { redirect } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TopInvestors from "@/components/leaderboard/TopInvestors";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";
import ContestsComingSoon from "@/components/leaderboard/ContestsComingSoon";
import PageHeader from "@/components/ui/PageHeader";
import { getCurrentUser } from "@/lib/session";
import { connectDB } from "@/lib/mongodb";
import { getLeaderboard } from "@/services/leaderboard.service";

export default async function LeaderboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  await connectDB();
  const investors = await getLeaderboard(user.id);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHeader
          title="Leaderboard"
          description="Global rankings — compete and climb toward Market Wizard."
        />
        <ContestsComingSoon />
        <TopInvestors investors={investors} />
        <LeaderboardTable investors={investors} />
      </div>
    </DashboardLayout>
  );
}
