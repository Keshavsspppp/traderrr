import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

import { connectDB } from "../lib/mongodb";
import { isLiveMarketEnabled } from "../lib/market-data";
import { syncMarketPrices } from "../services/market-sync.service";

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is missing in .env.local");
    process.exit(1);
  }

  if (!isLiveMarketEnabled()) {
    console.error(
      "Set TWELVE_DATA_API_KEY or ALPHA_VANTAGE_API_KEY in .env.local"
    );
    process.exit(1);
  }

  await connectDB();
  console.log("Syncing live market prices (this may take a few minutes)...");
  const result = await syncMarketPrices({ force: true });
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
