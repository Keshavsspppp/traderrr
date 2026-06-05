"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function JoinContestModal({
  open,
  contestId,
  isInviteOnly,
  onClose,
  onJoined,
}: {
  open: boolean;
  contestId: string;
  isInviteOnly: boolean;
  onClose: () => void;
  onJoined: () => void;
}) {
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const join = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/contests/${contestId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isInviteOnly ? { inviteCode } : {}),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Failed to join");
        return;
      }
      toast.success("Joined contest");
      onJoined();
      onClose();
    } catch {
      toast.error("Failed to join");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4">
      <div className="w-full rounded-t-3xl border border-white/10 bg-zinc-950 p-5 sm:max-w-md sm:rounded-3xl sm:p-6">
        <h2 className="text-2xl font-bold">Join Contest</h2>
        {isInviteOnly && (
          <>
            <p className="mt-1 text-sm text-zinc-400">Enter the invite code to join.</p>
            <label className="mt-6 block text-sm text-zinc-400">Invite code</label>
            <input
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 p-3"
              placeholder="e.g. A1B2C3"
            />
          </>
        )}
        {!isInviteOnly && <p className="mt-2 text-sm text-zinc-400">This contest is open to everyone.</p>}

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
            onClick={join}
            disabled={loading || (isInviteOnly && inviteCode.trim().length < 4)}
            className="flex-1 rounded-xl bg-green-500 py-3 font-semibold text-black disabled:opacity-50"
          >
            {loading ? "Joining..." : "Join"}
          </button>
        </div>
      </div>
    </div>
  );
}
