import MarketView from "@/components/market/MarketView";
import PageHeader from "@/components/ui/PageHeader";
import { connectDB } from "@/lib/mongodb";
import { requireUser } from "@/lib/api-auth";
import { getContest } from "@/services/contest.service";

export default async function ContestMarketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await connectDB();
  const user = await requireUser();
  const contest = await getContest(id, user._id.toString());

  if (!contest.joined) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <PageHeader
          title="Contest Market"
          description="Join this contest to trade with an isolated paper portfolio."
        />
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-400">
          You are not in this contest.
        </div>
      </div>
    );
  }

  return (
    <MarketView
      contestId={id}
      header={{
        title: `Market · ${contest.title}`,
        description: "Trades placed here affect only your contest portfolio.",
      }}
    />
  );
}
