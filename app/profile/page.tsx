import { redirect } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import UserStats from "@/components/profile/UserStats";
import AchievementCard from "@/components/profile/AchievementCard";
import SettingsCard from "@/components/profile/SettingsCard";
import PageHeader from "@/components/ui/PageHeader";
import { getCurrentUser } from "@/lib/session";
import { connectDB } from "@/lib/mongodb";
import { requireUser } from "@/lib/api-auth";
import { processAchievements, getXpProgress } from "@/services/gamification.service";
import { getCurrentUserRank } from "@/services/leaderboard.service";
import { getRoiPercent } from "@/services/portfolio.service";
import { toSafeUser } from "@/lib/session";
import { ACHIEVEMENT_DEFS } from "@/lib/constants";

export default async function ProfilePage() {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) redirect("/login");

  await connectDB();
  const user = await requireUser();
  await processAchievements(user);

  const rank = await getCurrentUserRank(user._id.toString());
  const xpProgress = getXpProgress(user.xp, user.level);
  const roi = getRoiPercent(user.totalPortfolioValue);
  const safeUser = toSafeUser(user);

  const achievements = Object.values(ACHIEVEMENT_DEFS).map((def) => ({
    id: def.id,
    title: def.title,
    description: def.description,
    earned: user.achievements.includes(def.id),
  }));

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHeader
          title="Profile"
          description="Investor level, achievements, and account settings."
        />
        <UserStats user={safeUser} rank={rank} roi={roi} xpProgress={xpProgress} />
        <div className="grid gap-6 lg:grid-cols-2">
          <AchievementCard achievements={achievements} />
          <SettingsCard user={safeUser} />
        </div>
      </div>
    </DashboardLayout>
  );
}
