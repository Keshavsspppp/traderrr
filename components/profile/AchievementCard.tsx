import { Award, Crown, Medal, Star } from "lucide-react";

export type AchievementItem = {
  id: string;
  title: string;
  description: string;
  earned: boolean;
};

const iconMap: Record<string, typeof Award> = {
  first_trade: Award,
  trades_10: Medal,
  top_100: Crown,
  growth_20: Star,
};

export default function AchievementCard({
  achievements,
}: {
  achievements: AchievementItem[];
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <h2 className="mb-6 text-2xl font-semibold">Achievements</h2>
      <div className="space-y-4">
        {achievements.map((achievement) => {
          const Icon = iconMap[achievement.id] ?? Award;
          return (
            <div
              key={achievement.id}
              className={`flex items-center gap-4 rounded-2xl border p-4 ${
                achievement.earned
                  ? "border-green-500/30 bg-green-500/10"
                  : "border-white/5 bg-black/20 opacity-50"
              }`}
            >
              <Icon className={achievement.earned ? "text-green-400" : "text-zinc-500"} />
              <div>
                <h3 className="font-medium">{achievement.title}</h3>
                <p className="text-sm text-zinc-400">{achievement.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
