import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { takeDailySnapshotsForAllUsers } from "@/services/snapshot.service";

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");

  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const result = await takeDailySnapshotsForAllUsers();
  return NextResponse.json(result);
}
