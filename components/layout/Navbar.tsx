"use client";

import { Bell, Search, TrendingUp } from "lucide-react";
import { useUser } from "@/components/providers/UserProvider";

export default function Navbar() {
  const { user } = useUser();
  const initial = user?.name?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-2 px-4 py-3 pl-14 sm:gap-4 sm:px-6 sm:py-4 lg:pl-6">
        {/* Search — hidden on small phones; market page has its own search */}
        <div className="hidden min-w-0 flex-1 sm:flex sm:max-w-xs md:max-w-sm">
          <div className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5">
            <Search size={18} className="shrink-0 text-zinc-400" />
            <input
              type="text"
              placeholder="Search stocks..."
              className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-zinc-500"
            />
          </div>
        </div>

        {/* Spacer on mobile when search is hidden */}
        <div className="flex-1 sm:hidden" />

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <div className="hidden items-center gap-2 rounded-xl bg-green-500/10 px-3 py-1.5 text-green-400 md:flex">
            <TrendingUp size={16} />
            <span className="text-sm">Market Open</span>
          </div>

          <button
            type="button"
            aria-label="Notifications"
            className="relative rounded-xl border border-white/10 bg-white/5 p-2.5 hover:bg-white/10 sm:p-3"
          >
            <Bell size={18} className="sm:h-5 sm:w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-green-400" />
          </button>

          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-2 py-1.5 sm:gap-3 sm:px-4 sm:py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-black sm:h-10 sm:w-10 sm:text-base">
              {initial}
            </div>
            <div className="hidden min-w-0 md:block">
              <h4 className="truncate text-sm font-medium">{user?.name ?? "Investor"}</h4>
              <p className="truncate text-xs text-zinc-400">{user?.levelTitle ?? "Investor"}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
