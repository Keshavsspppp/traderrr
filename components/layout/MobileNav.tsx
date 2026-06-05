"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BriefcaseBusiness,
  ChartCandlestick,
  LayoutDashboard,
  ListOrdered,
  Trophy,
  User,
} from "lucide-react";

const items = [
  { name: "Home", href: "/dashboard", icon: LayoutDashboard },
  { name: "Market", href: "/market", icon: ChartCandlestick },
  { name: "Portfolio", href: "/portfolio", icon: BriefcaseBusiness },
  { name: "Ranks", href: "/leaderboard", icon: ListOrdered },
  { name: "Contests", href: "/contests", icon: Trophy },
  { name: "Profile", href: "/profile", icon: User },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-zinc-950/95 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-1 py-1.5">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-2 text-[10px] font-medium transition ${
                active ? "text-green-400" : "text-zinc-500"
              }`}
            >
              <item.icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
