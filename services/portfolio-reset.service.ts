import Holding from "@/models/Holding";
import Transaction from "@/models/Transaction";
import PortfolioSnapshot from "@/models/PortfolioSnapshot";
import type { IUser } from "@/models/User";
import { INITIAL_VIRTUAL_CASH } from "@/lib/constants";

export async function resetUserPortfolio(user: IUser) {
  const userId = user._id;

  await Promise.all([
    Holding.deleteMany({ userId }),
    Transaction.deleteMany({ userId }),
    PortfolioSnapshot.deleteMany({ userId }),
  ]);

  user.cashBalance = INITIAL_VIRTUAL_CASH;
  user.totalPortfolioValue = INITIAL_VIRTUAL_CASH;
  user.xp = 0;
  user.level = 1;
  user.achievements = [];
  await user.save();

  await PortfolioSnapshot.create({
    userId,
    value: INITIAL_VIRTUAL_CASH,
    date: new Date(),
  });

  return user;
}
