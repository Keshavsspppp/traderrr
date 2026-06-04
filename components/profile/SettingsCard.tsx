import type { SafeUser } from "@/lib/session";

export default function SettingsCard({ user }: { user: SafeUser }) {
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
    </div>
  );
}
