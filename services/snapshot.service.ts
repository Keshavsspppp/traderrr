import User from "@/models/User";
import PortfolioSnapshot from "@/models/PortfolioSnapshot";
import { computePortfolioValue } from "@/services/portfolio.service";

export async function takeDailySnapshotsForAllUsers() {
  const users = await User.find().select("_id cashBalance");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let created = 0;
  let skipped = 0;

  for (const user of users) {
    const existing = await PortfolioSnapshot.findOne({
      userId: user._id,
      date: { $gte: today },
    });
    if (existing) {
      skipped += 1;
      continue;
    }

    const value = await computePortfolioValue(user);
    await PortfolioSnapshot.create({
      userId: user._id,
      value,
      date: new Date(),
    });
    created += 1;
  }

  return { created, skipped, total: users.length };
}
