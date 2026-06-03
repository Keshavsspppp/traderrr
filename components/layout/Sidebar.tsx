"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ChartCandlestick,
  BriefcaseBusiness,
  Trophy,
  User,
  LogOut,
} from "lucide-react";

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Market",
    href: "/market",
    icon: ChartCandlestick,
  },
  {
    name: "Portfolio",
    href: "/portfolio",
    icon: BriefcaseBusiness,
  },
  {
    name: "Leaderboard",
    href: "/leaderboard",
    icon: Trophy,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="
        fixed
        left-0
        top-0
        hidden
        h-screen
        w-72
        border-r
        border-white/10
        bg-black/60
        backdrop-blur-xl
        lg:flex
        lg:flex-col
      "
    >
      {/* Logo */}
      <div className="border-b border-white/10 p-8">
        <h1 className="text-3xl font-bold">
          Invest
          <span className="text-green-400">
            Arena
          </span>
        </h1>

        <p className="mt-2 text-sm text-zinc-400">
          Virtual Trading Platform
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href;

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`
                    flex
                    items-center
                    gap-4
                    rounded-2xl
                    px-4
                    py-4
                    transition-all
                    duration-300

                    ${
                      isActive
                        ? "bg-green-500 text-black font-semibold"
                        : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    }
                  `}
                >
                  <item.icon size={22} />

                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Card */}
      <div className="border-t border-white/10 p-4">
        <div
          className="
            rounded-2xl
            bg-white/5
            p-4
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-green-500
                font-bold
                text-black
              "
            >
              K
            </div>

            <div>
              <h4 className="font-medium">
                Keshav
              </h4>

              <p className="text-xs text-zinc-400">
                Level 5 Investor
              </p>
            </div>
          </div>

          <button
            className="
              mt-4
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-red-500/10
              py-3
              text-red-400
              transition
              hover:bg-red-500/20
            "
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}