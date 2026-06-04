import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api-auth";
import { apiHandler } from "@/lib/errors";
import { syncMarketPrices } from "@/services/market-sync.service";

export const POST = apiHandler(async () => {
  await requireUser();
  const result = await syncMarketPrices({ force: true, maxSymbols: 24 });
  return NextResponse.json(result);
});
