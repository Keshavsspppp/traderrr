"use client";

import { Bell, Search, TrendingUp } from "lucide-react";
import { useUser } from "@/components/providers/UserProvider";

export default function Navbar() {
  const { user } = useUser();
  const initial = user?.name?.charAt(0)?.toUpperCase() ?? "?";
  return (
    <header
      className="
        sticky
        top-0
        z-30
        border-b
        border-white/10
        bg-black/70
        px-6
        py-4
        backdrop-blur-xl
      "
    >
      <div className="flex items-center justify-between">
        {/* Search */}
        <div
          className="
            flex
            items-center
            gap-3
            rounded-2xl
            border
            border-white/10
            bg-white/5
            px-4
            py-3
            w-full max-w-[280px] sm:max-w-[320px]
          "
        >
          <Search
            size={18}
            className="text-zinc-400"
          />

          <input
            type="text"
            placeholder="Search stocks..."
            className="
              w-full
              bg-transparent
              text-sm
              outline-none
              placeholder:text-zinc-500
            "
          />
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Market Status */}
          <div
            className="
              hidden
              items-center
              gap-2
              rounded-xl
              bg-green-500/10
              px-4
              py-2
              text-green-400
              md:flex
            "
          >
            <TrendingUp size={18} />

            <span className="text-sm">
              Market Open
            </span>
          </div>

          {/* Notification */}
          <button
            className="
              relative
              rounded-xl
              border
              border-white/10
              bg-white/5
              p-3
              hover:bg-white/10
            "
          >
            <Bell size={20} />

            <span
              className="
                absolute
                right-2
                top-2
                h-2
                w-2
                rounded-full
                bg-green-400
              "
            />
          </button>

          {/* Profile */}
          <div
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-white/10
              bg-white/5
              px-4
              py-2
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-green-500
                font-bold
                text-black
              "
            >
              {initial}
            </div>

            <div className="hidden md:block">
              <h4 className="text-sm font-medium">{user?.name ?? "Investor"}</h4>
              <p className="text-xs text-zinc-400">{user?.levelTitle ?? "Investor"}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}