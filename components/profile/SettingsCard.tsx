"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import type { SafeUser } from "@/lib/session";

export default function SettingsCard({ user }: { user: SafeUser }) {
  const [resetting, setResetting] = useState(false);

  const resetPortfolio = async () => {
    if (
      !confirm(
        "Reset your portfolio to ₹10L virtual cash? This deletes all holdings, trades, and snapshots."
      )
    ) {
      return;
    }
    setResetting(true);
    try {
      const res = await fetch("/api/profile/reset", { method: "POST" });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Reset failed");
        return;
      }
      toast.success("Portfolio reset — fresh start with ₹10L!");
      window.location.reload();
    } catch {
      toast.error("Reset failed");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <h2 className="mb-6 text-2xl font-semibold">Account</h2>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-zinc-400">Name</label>
          <p className="mt-1 font-medium">{user.name}</p>
        </div>
        <div>
          <label className="text-sm text-zinc-400">Email</label>
          <p className="mt-1 font-medium">{user.email}</p>
        </div>
        <div>
          <label className="text-sm text-zinc-400">Role</label>
          <p className="mt-1 font-medium">{user.role}</p>
        </div>
        <div>
          <label className="text-sm text-zinc-400">Available Cash</label>
          <p className="mt-1 font-medium text-green-400">
            ₹{user.cashBalance.toLocaleString("en-IN")}
          </p>
        </div>
      </div>
      <div className="mt-8 border-t border-white/10 pt-6">
        <h3 className="text-sm font-medium text-zinc-300">Danger zone</h3>
        <p className="mt-1 text-xs text-zinc-500">
          Reset your virtual portfolio and start over with ₹10 lakh.
        </p>
        <button
          type="button"
          onClick={resetPortfolio}
          disabled={resetting}
          className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
        >
          {resetting ? "Resetting…" : "Reset Portfolio"}
        </button>
      </div>
    </div>
  );
}
