import DashboardLayout from "@/components/layout/DashboardLayout";
import UserStats from "@/components/profile/UserStats";
import AchievementCard from "@/components/profile/AchievementCard";
import SettingsCard from "@/components/profile/SettingsCard";

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">
            Profile
          </h1>

          <p className="mt-2 text-zinc-400">
            Manage your investor profile and achievements.
          </p>
        </div>

        <UserStats />

        <div className="grid gap-6 lg:grid-cols-2">
          <AchievementCard />
          <SettingsCard />
        </div>
      </div>
    </DashboardLayout>
  );
}