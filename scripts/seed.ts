import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

import { connectDB } from "../lib/mongodb";
import { hashPassword } from "../lib/auth";
import { INITIAL_VIRTUAL_CASH } from "../lib/constants";
import { SEED_STOCKS } from "../lib/seed-data";
import Stock from "../models/Stock";
import User from "../models/User";
import Watchlist from "../models/Watchlist";

async function seedStocks() {
  for (const s of SEED_STOCKS) {
    const previousClose =
      s.currentPrice / (1 + s.changePercent / 100);
    await Stock.findOneAndUpdate(
      { symbol: s.symbol },
      {
        symbol: s.symbol,
        companyName: s.companyName,
        sector: s.sector,
        currentPrice: s.currentPrice,
        previousClose: Math.round(previousClose * 100) / 100,
        changePercent: s.changePercent,
        marketCap: s.marketCap,
      },
      { upsert: true, new: true }
    );
  }
  console.log(`Seeded ${SEED_STOCKS.length} stocks`);
}

async function seedDemoUser() {
  const email = "demo@investarena.com";
  const existing = await User.findOne({ email });
  if (existing) {
    console.log("Demo user already exists:", email);
    return;
  }

  const password = await hashPassword("demo12345");
  const user = await User.create({
    name: "Demo Investor",
    email,
    password,
    cashBalance: INITIAL_VIRTUAL_CASH,
    totalPortfolioValue: INITIAL_VIRTUAL_CASH,
  });
  await Watchlist.create({ userId: user._id, stocks: [] });
  console.log("Demo user created:", email, "password: demo12345");
}

async function main() {
  const withDemo = process.argv.includes("--demo-user");

  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is missing in .env.local");
    process.exit(1);
  }

  await connectDB();
  await seedStocks();

  if (withDemo) {
    await seedDemoUser();
  }

  console.log("Seed complete");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
