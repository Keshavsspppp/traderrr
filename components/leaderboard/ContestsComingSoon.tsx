import { Calendar, Trophy } from "lucide-react";

export default function ContestsComingSoon() {
  return (
    <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent p-8">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-amber-500/20 p-3 text-amber-400">
          <Trophy size={28} />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Portfolio Contests</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">
            Weekly and monthly trading competitions are on the roadmap. Compete
            for top ROI, sector mastery badges, and exclusive achievements.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-300">
            <Calendar size={16} />
            Coming soon
          </div>
        </div>
      </div>
    </div>
  );
}
