"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "@/components/ui/PageHeader";
import CreateContestModal from "@/components/contests/CreateContestModal";
import JoinContestModal from "@/components/contests/JoinContestModal";

type ContestListItem = {
  id: string;
  title: string;
  startingBalance: number;
  startDate: string;
  endDate: string;
  status: "UPCOMING" | "ACTIVE" | "ENDED";
  isInviteOnly: boolean;
  recurrence: "NONE" | "WEEKLY" | "MONTHLY";
  participantsCount: number;
  joined: boolean;
};

function formatStatus(status: ContestListItem["status"]) {
  if (status === "UPCOMING") return { label: "Upcoming", cls: "bg-amber-500/15 text-amber-300" };
  if (status === "ACTIVE") return { label: "Live", cls: "bg-green-500/15 text-green-400" };
  return { label: "Ended", cls: "bg-zinc-800 text-zinc-300" };
}

export default function ContestsClient() {
  const [contests, setContests] = useState<ContestListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [joinTarget, setJoinTarget] = useState<ContestListItem | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contests");
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Failed to load contests");
        return;
      }
      setContests(json.contests ?? []);
    } catch {
      toast.error("Failed to load contests");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const grouped = useMemo(() => {
    const upcoming = contests.filter((c) => c.status === "UPCOMING");
    const active = contests.filter((c) => c.status === "ACTIVE");
    const ended = contests.filter((c) => c.status === "ENDED");
    return { upcoming, active, ended };
  }, [contests]);

  const requestJoin = async (contest: ContestListItem) => {
    if (contest.joined) return;
    if (contest.status !== "UPCOMING") {
      toast.error("You can only join before the contest starts");
      return;
    }
    if (contest.isInviteOnly) {
      setJoinTarget(contest);
      return;
    }

    const res = await fetch(`/api/contests/${contest.id}/join`, { method: "POST" });
    const json = await res.json();
    if (!res.ok) {
      toast.error(json.error ?? "Failed to join");
      return;
    }
    toast.success("Joined contest");
    load();
  };

  const ContestCard = ({ contest }: { contest: ContestListItem }) => {
    const status = formatStatus(contest.status);
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold">{contest.title}</h3>
            <p className="mt-1 text-sm text-zinc-400">
              {new Date(contest.startDate).toLocaleString("en-IN")} →{" "}
              {new Date(contest.endDate).toLocaleString("en-IN")}
            </p>
          </div>
          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${status.cls}`}>
            {status.label}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
          <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1">
            {contest.participantsCount} players
          </span>
          {contest.isInviteOnly && (
            <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1">
              Invite-only
            </span>
          )}
          {contest.recurrence !== "NONE" && (
            <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1">
              {contest.recurrence.toLowerCase()}
            </span>
          )}
        </div>

        <div className="mt-5 flex gap-3">
          {contest.joined ? (
            <Link
              href={`/contests/${contest.id}`}
              className="flex-1 rounded-xl bg-green-500 py-2.5 text-center text-sm font-semibold text-black"
            >
              Open
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => requestJoin(contest)}
              className="flex-1 rounded-xl bg-white/10 py-2.5 text-sm font-semibold text-white hover:bg-white/15"
            >
              Join
            </button>
          )}
          <Link
            href={`/contests/${contest.id}`}
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-zinc-200 hover:bg-white/5"
          >
            Details
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Contests"
          description="Weekly and monthly ROI seasons with isolated paper-trading portfolios."
        />
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="rounded-xl bg-green-500 px-5 py-2.5 text-sm font-semibold text-black"
        >
          Create
        </button>
      </div>

      {loading && contests.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-400">
          Loading contests…
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.active.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Live</h2>
              <div className="grid gap-4 lg:grid-cols-2">
                {grouped.active.map((c) => (
                  <ContestCard key={c.id} contest={c} />
                ))}
              </div>
            </div>
          )}

          {grouped.upcoming.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Upcoming</h2>
              <div className="grid gap-4 lg:grid-cols-2">
                {grouped.upcoming.map((c) => (
                  <ContestCard key={c.id} contest={c} />
                ))}
              </div>
            </div>
          )}

          {grouped.ended.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Ended</h2>
              <div className="grid gap-4 lg:grid-cols-2">
                {grouped.ended.map((c) => (
                  <ContestCard key={c.id} contest={c} />
                ))}
              </div>
            </div>
          )}

          {contests.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-400">
              No contests yet. Create one to start competing.
            </div>
          )}
        </div>
      )}

      <CreateContestModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={load}
      />
      {joinTarget && (
        <JoinContestModal
          open={!!joinTarget}
          contestId={joinTarget.id}
          isInviteOnly={joinTarget.isInviteOnly}
          onClose={() => setJoinTarget(null)}
          onJoined={load}
        />
      )}
    </div>
  );
}
