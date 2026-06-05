"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";

export default function CreateContestModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const defaults = useMemo(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const startLocal = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    const end = new Date(d.getTime() + 7 * 24 * 60 * 60 * 1000);
    const endLocal = `${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())}T${pad(end.getHours())}:${pad(end.getMinutes())}`;
    return { startLocal, endLocal };
  }, []);

  const [title, setTitle] = useState("Weekly ROI Clash");
  const [startingBalance, setStartingBalance] = useState(100000);
  const [startDate, setStartDate] = useState(defaults.startLocal);
  const [endDate, setEndDate] = useState(defaults.endLocal);
  const [recurrence, setRecurrence] = useState<"NONE" | "WEEKLY" | "MONTHLY">("WEEKLY");
  const [isInviteOnly, setIsInviteOnly] = useState(true);
  const [inviteCode, setInviteCode] = useState("");
  const [maxParticipants, setMaxParticipants] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const submit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          startingBalance,
          startDate,
          endDate,
          recurrence,
          isInviteOnly,
          inviteCode: isInviteOnly ? inviteCode || undefined : undefined,
          maxParticipants: maxParticipants === "" ? undefined : maxParticipants,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Failed to create contest");
        return;
      }
      if (json.inviteCode) {
        toast.success(`Contest created. Invite code: ${json.inviteCode}`);
      } else {
        toast.success("Contest created");
      }
      onCreated();
      onClose();
    } catch {
      toast.error("Failed to create contest");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-white/10 bg-zinc-950 p-5 sm:max-w-lg sm:rounded-3xl sm:p-6">
        <h2 className="text-2xl font-bold">Create Contest</h2>
        <p className="mt-1 text-sm text-zinc-400">Create a paper-trading season with isolated cash and holdings.</p>

        <label className="mt-6 block text-sm text-zinc-400">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 p-3"
        />

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm text-zinc-400">Starting balance</label>
            <input
              type="number"
              min={1}
              value={startingBalance}
              onChange={(e) => setStartingBalance(Number(e.target.value))}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 p-3"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400">Max participants</label>
            <input
              type="number"
              min={2}
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value === "" ? "" : Number(e.target.value))}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 p-3"
            />
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm text-zinc-400">Start</label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 p-3"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400">End</label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 p-3"
            />
          </div>
        </div>

        <label className="mt-4 block text-sm text-zinc-400">Season</label>
        <select
          value={recurrence}
          onChange={(e) => setRecurrence(e.target.value as "NONE" | "WEEKLY" | "MONTHLY")}
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 p-3"
        >
          <option value="NONE">One-off</option>
          <option value="WEEKLY">Weekly</option>
          <option value="MONTHLY">Monthly</option>
        </select>

        <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-black/30 p-4">
          <div>
            <p className="text-sm font-medium">Invite-only</p>
            <p className="text-xs text-zinc-500">Require a code to join before the contest starts.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsInviteOnly((v) => !v)}
            className={`h-8 w-14 rounded-full p-1 transition ${isInviteOnly ? "bg-green-500" : "bg-white/10"}`}
            aria-label="Toggle invite-only"
          >
            <div className={`h-6 w-6 rounded-full bg-black transition ${isInviteOnly ? "translate-x-6" : ""}`} />
          </button>
        </div>

        {isInviteOnly && (
          <>
            <label className="mt-4 block text-sm text-zinc-400">Invite code (optional)</label>
            <input
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 p-3"
              placeholder="Leave blank to auto-generate"
            />
          </>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/10 py-3"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={loading}
            className="flex-1 rounded-xl bg-green-500 py-3 font-semibold text-black disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
