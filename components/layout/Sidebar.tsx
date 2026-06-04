"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BriefcaseBusiness,
  ChartCandlestick,
  LayoutDashboard,
  LogOut,
  Menu,
  Trophy,
  User,
  X,
} from "lucide-react";
import { useUser } from "@/components/providers/UserProvider";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Market", href: "/market", icon: ChartCandlestick },
  { name: "Portfolio", href: "/portfolio", icon: BriefcaseBusiness },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Profile", href: "/profile", icon: User },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <ul className="space-y-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <li key={item.name}>
            <Link
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-all duration-200 ${
                isActive
                  ? "bg-green-500 font-semibold text-black"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useUser();
  const initial = user?.name?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-xl border border-white/10 bg-black/80 p-3 backdrop-blur lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-white/10 bg-zinc-950 transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <div>
            <h1 className="text-2xl font-bold">
              Invest<span className="text-green-400">Arena</span>
            </h1>
            <p className="mt-1 text-xs text-zinc-500">Virtual Trading Platform</p>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <NavLinks onNavigate={() => setMobileOpen(false)} />
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="rounded-2xl bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-500 text-lg font-bold text-black">
                {initial}
              </div>
              <div>
                <h4 className="font-medium">{user?.name ?? "Investor"}</h4>
                <p className="text-xs text-zinc-400">
                  Level {user?.level ?? 1} · {user?.levelTitle ?? "Beginner"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 py-2.5 text-sm text-red-400 transition hover:bg-red-500/20"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
