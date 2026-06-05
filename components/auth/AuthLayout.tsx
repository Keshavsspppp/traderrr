"use client";

import { motion } from "framer-motion";
import MarketChart from "../charts/MarketChart";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({
  children,
}: AuthLayoutProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-black to-emerald-500/10" />

      {/* Grid Pattern */}
      <div
        className="
          absolute
          inset-0
          bg-[linear-gradient(to_right,#26262620_1px,transparent_1px),linear-gradient(to_bottom,#26262620_1px,transparent_1px)]
          bg-[size:50px_50px]
        "
      />

      {/* Glow Effects */}
      <div className="absolute left-20 top-20 h-72 w-72 rounded-full bg-green-500/20 blur-[120px]" />
      <div className="absolute right-20 bottom-20 h-72 w-72 rounded-full bg-emerald-500/20 blur-[120px]" />

      <div className="relative z-10 grid min-h-screen lg:grid-cols-2">

        {/* Left Section */}
        <section className="hidden lg:flex flex-col justify-between p-12 xl:p-20">

          <div>
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-extrabold tracking-tight">
                InvestArena
              </h1>

              <p className="mt-2 text-zinc-400">
                Virtual Trading Platform
              </p>
            </motion.div>
          </div>

          <div className="relative">

            <motion.h2
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 text-6xl font-bold leading-tight"
            >
              Master the
              <span className="block text-green-400">
                Stock Market
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="max-w-lg text-lg text-zinc-400"
            >
              Learn investing through real-time simulations,
              AI-powered insights, portfolio battles,
              and historical market scenarios.
            </motion.p>

            <div className="relative mt-12 h-72">
              <MarketChart />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-3 gap-4"
          >
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
              <h3 className="text-2xl font-bold text-green-400">
                ₹10L+
              </h3>
              <p className="text-sm text-zinc-400">
                Virtual Trades
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
              <h3 className="text-2xl font-bold text-green-400">
                500+
              </h3>
              <p className="text-sm text-zinc-400">
                Stocks
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
              <h3 className="text-2xl font-bold text-green-400">
                24/7
              </h3>
              <p className="text-sm text-zinc-400">
                AI Mentor
              </p>
            </div>
          </motion.div>

        </section>

        {/* Right Section */}
        <section className="flex items-center justify-center p-6 sm:p-10">

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="
              w-full
              max-w-md
              rounded-3xl
              border
              border-white/10
              bg-white/5
              p-5
              sm:p-8
              backdrop-blur-2xl
              shadow-[0_0_50px_rgba(34,197,94,0.08)]
            "
          >
            {children}
          </motion.div>

        </section>
      </div>
    </main>
  );
} 