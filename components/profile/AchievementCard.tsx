import {
  Award,
  Medal,
  Crown,
  Star,
} from "lucide-react";

const achievements = [
  {
    title: "First Trade",
    icon: Award,
  },
  {
    title: "10 Trades Completed",
    icon: Medal,
  },
  {
    title: "Top 100 Investor",
    icon: Crown,
  },
  {
    title: "Portfolio Growth 20%",
    icon: Star,
  },
];

export default function AchievementCard() {
  return (
    <div
      className="
      rounded-3xl
      border
      border-white/10
      bg-white/5
      p-6
      backdrop-blur-xl
    "
    >
      <h2 className="mb-6 text-2xl font-semibold">
        Achievements
      </h2>

      <div className="space-y-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.title}
            className="
              flex
              items-center
              gap-4
              rounded-2xl
              bg-black/20
              p-4
            "
          >
            <achievement.icon
              className="text-green-400"
              size={24}
            />

            <span>{achievement.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}