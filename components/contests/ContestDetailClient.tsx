"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "@/components/ui/PageHeader";
import { formatCurrency, formatPercent } from "@/lib/format";
import JoinContestModal from "@/components/contests/JoinContestModal";
import ContestLeaderboardTable from "@/components/contests/ContestLeaderboardTable";

type Contest = {
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
  creatorName?: string | null;
  myAccount: null | {
    cashBalance: number;
    totalPortfolioValue: number;
    roi: number;
  };
};

type Row = {
  rank: number;
  name: string;
  portfolioValue: number;
  returns: number;
  isCurrentUser?: boolean;
};

function statusLabel(status: Contest["status"]) {
  if (status === "UPCOMING") return { label: "Upcoming", cls: "bg-amber-500/15 text-amber-300" };
  if (status === "ACTIVE") return { label: "Live", cls: "bg-green-500/15 text-green-400" };
  return { label: "Ended", cls: "bg-zinc-800 text-zinc-300" };
}

export default function ContestDetailClient({ contestId }: { contestId: string }) {
  const [contest, setContest] = useState<Contest | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [joinOpen, setJoinOpen] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/contests/${contestId}`);
    const json = await res.json();
    if (!res.ok) {
      toast.error(json.error ?? "Failed to load contest");
      return;
    }
    setContest(json.contest);
  }, [contestId]);

  const loadLeaderboard = useCallback(async () => {
    const res = await fetch(`/api/contests/${contestId}/leaderboard`);
    const json = await res.json();
    if (!res.ok) return;
    setRows(json.leaderboard ?? []);
  }, [contestId]);

  useEffect(() => {
    load();
    loadLeaderboard();
    const interval = setInterval(loadLeaderboard, 5000);
    return () => clearInterval(interval);
  }, [load, loadLeaderboard]);

  const canJoin = contest?.status === "UPCOMING" && !contest?.joined;
  const canLeave = contest?.status === "UPCOMING" && contest?.joined;

  const leave = async () => {
    const res = await fetch(`/api/contests/${contestId}/leave`, { method: "POST" });
    const json = await res.json();
    if (!res.ok) {
      toast.error(json.error ?? "Failed to leave contest");
      return;
    }
    toast.success("Left contest");
    load();
    loadLeaderboard();
  };

  const header = useMemo(() => {
    const title = contest?.title ?? "Contest";
    const description = contest
      ? `${new Date(contest.startDate).toLocaleString("en-IN")} → ${new Date(contest.endDate).toLocaleString("en-IN")}`
      : "Loading contest…";
    return { title, description };
  }, [contest]);

  if (!contest) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-400">
        Loading contest…
      </div>
    );
  }

  const status = statusLabel(contest.status);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader title={header.title} description={header.description} />
        <div className="flex flex-wrap items-center gap-3">
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${status.cls}`}>
            {status.label}
          </span>
          {contest.isInviteOnly && (
            <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-zinc-300">
              Invite-only
            </span>
          )}
          {contest.creatorName && (
            <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-zinc-300">
              By {contest.creatorName}
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <p className="text-sm text-zinc-400">Starting balance</p>
          <p className="mt-2 text-2xl font-bold text-green-400">{formatCurrency(contest.startingBalance)}</p>
          <p className="mt-4 text-sm text-zinc-400">Players</p>
          <p className="mt-2 text-xl font-semibold">{contest.participantsCount}</p>
          {contest.recurrence !== "NONE" && (
            <>
              <p className="mt-4 text-sm text-zinc-400">Season</p>
              <p className="mt-2 text-xl font-semibold">{contest.recurrence.toLowerCase()}</p>
            </>
          )}
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl lg:col-span-2">
          <div className="flex flex-wrap gap-3">
            {contest.joined ? (
              <>
                <Link
                  href={`/contests/${contest.id}/market`}
                  className="rounded-xl bg-green-500 px-5 py-2.5 text-sm font-semibold text-black"
                >
                  Trade
                </Link>
                <Link
                  href={`/contests/${contest.id}/portfolio`}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Portfolio
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={() => toast.error("Join the contest to trade")}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-zinc-400"
              >
                Trade
              </button>
            )}

            {canJoin && (
              <button
                type="button"
                onClick={() => (contest.isInviteOnly ? setJoinOpen(true) : setJoinOpen(true))}
                className="rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/15"
              >
                Join
              </button>
            )}
            {canLeave && (
              <button
                type="button"
                onClick={leave}
                className="rounded-xl bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/20"
              >
                Leave
              </button>
            )}
          </div>

          {contest.myAccount && (
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-zinc-500">Cash</p>
                <p className="mt-1 font-semibold">{formatCurrency(contest.myAccount.cashBalance)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-zinc-500">Total value</p>
                <p className="mt-1 font-semibold">{formatCurrency(contest.myAccount.totalPortfolioValue)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-zinc-500">ROI</p>
                <p className="mt-1 font-semibold text-green-400">{formatPercent(contest.myAccount.roi)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <ContestLeaderboardTable title="Contest Leaderboard" rows={rows} />

      <JoinContestModal
        open={joinOpen}
        contestId={contestId}
        isInviteOnly={contest.isInviteOnly}
        onClose={() => setJoinOpen(false)}
        onJoined={() => {
          load();
          loadLeaderboard();
        }}
      />
    </div>
  );
}
