"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Brain,
  ChartLine,
  Shield,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K+`;
  return String(n);
}

const features = [
  {
    icon: ChartLine,
    title: "Virtual Trading",
    description:
      "Buy and sell stocks with ₹10L virtual capital. Realistic market simulation with zero financial risk.",
  },
  {
    icon: Brain,
    title: "AI Portfolio Mentor",
    description:
      "Health scores, risk assessment, and diversification insights tailored to your holdings.",
  },
  {
    icon: Trophy,
    title: "Global Leaderboard",
    description:
      "Compete weekly and monthly. Climb ranks and unlock achievements as you grow.",
  },
  {
    icon: Shield,
    title: "Safe Learning",
    description:
      "Practice strategies, track ROI, and build confidence before investing real money.",
  },
  {
    icon: Users,
    title: "Investor Levels",
    description:
      "Progress from Beginner to Market Wizard with XP, levels, and milestone badges.",
  },
  {
    icon: Zap,
    title: "Live Market Feel",
    description:
      "Track gainers, losers, and active stocks with a dashboard built for quick decisions.",
  },
];

const defaultStats = [
  { label: "Virtual Capital", value: "₹10L" },
  { label: "Stocks to Trade", value: "—" },
  { label: "Trades Executed", value: "—" },
  { label: "Active Investors", value: "—" },
];

export default function HomePage() {
  const [stats, setStats] = useState(defaultStats);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        setStats([
          { label: "Virtual Capital", value: data.virtualCapital ?? "₹10L" },
          { label: "Stocks to Trade", value: formatCount(data.stocks ?? 0) },
          { label: "Trades Executed", value: formatCount(data.trades ?? 0) },
          { label: "Active Investors", value: formatCount(data.users ?? 0) },
        ]);
      })
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-500">
              <span className="text-lg font-bold text-black">IA</span>
            </div>
            <span className="text-2xl font-bold tracking-tight">
              Invest<span className="text-green-400">Arena</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm md:flex">
            <Link href="#features" className="text-zinc-400 transition hover:text-green-400">
              Features
            </Link>
            <Link href="/leaderboard" className="text-zinc-400 transition hover:text-green-400">
              Leaderboard
            </Link>
            <Link href="/market" className="text-zinc-400 transition hover:text-green-400">
              Market
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden px-4 py-2 text-sm text-zinc-400 transition hover:text-white sm:inline"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-2xl bg-green-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-green-400 active:scale-95"
            >
              Start Free
            </Link>
          </div>
        </div>
      </header>

      <section className="mesh-bg relative flex min-h-[88vh] items-center justify-center px-6 pt-16 pb-24">
        <div className="relative z-10 max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-5 py-2 text-sm"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
            </span>
            Learn Investing. Compete. Grow.
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl"
          >
            Master trading.
            <br />
            <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
              Risk nothing.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400 sm:text-xl"
          >
            InvestArena is your virtual stock market simulator — trade, analyze portfolios with AI,
            and compete on leaderboards in a modern, gamified experience.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-col justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-green-500 px-8 py-4 text-lg font-semibold text-black transition hover:bg-green-400"
            >
              Start Trading Now
              <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/dashboard"
              className="rounded-2xl border border-white/20 px-8 py-4 text-lg transition hover:bg-white/5"
            >
              View Demo Dashboard
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4"
          >
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 backdrop-blur-sm"
              >
                <p className="text-2xl font-bold text-green-400">{item.value}</p>
                <p className="mt-1 text-xs text-zinc-500 sm:text-sm">{item.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="features" className="border-t border-white/10 bg-zinc-950/50 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Everything you need to learn investing</h2>
            <p className="mt-4 text-zinc-400">
              MVP features from our roadmap: dashboard analytics, market trading, portfolio
              management, leaderboards, and AI insights.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="card-hover rounded-3xl border border-white/10 bg-white/5 p-8"
              >
                <div className="mb-5 inline-flex rounded-2xl bg-green-500/10 p-3 text-green-400">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-3xl border border-green-500/20 bg-gradient-to-br from-green-500/10 to-transparent p-10 text-center sm:p-14">
          <h2 className="text-3xl font-bold">Ready to enter the arena?</h2>
          <p className="mx-auto mt-4 max-w-lg text-zinc-400">
            Create a free account, get ₹10 lakh virtual cash, and start your journey from Beginner
            Investor to Market Wizard.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex rounded-2xl bg-green-500 px-8 py-4 font-semibold text-black transition hover:bg-green-400"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} InvestArena — Virtual Trading Platform
          </p>
          <div className="flex gap-6 text-sm text-zinc-500">
            <Link href="/dashboard" className="hover:text-green-400">
              Dashboard
            </Link>
            <Link href="/market" className="hover:text-green-400">
              Market
            </Link>
            <Link href="/login" className="hover:text-green-400">
              Login
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
