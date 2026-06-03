import Link from "next/link";
import {
  ArrowRight,
  Brain,
  TrendingUp,
  Trophy,
  Shield,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <h1 className="text-2xl font-bold">
            Invest<span className="text-green-400">Arena</span>
          </h1>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-zinc-400 hover:text-white"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-xl bg-green-500 px-5 py-2.5 font-medium text-black hover:bg-green-400"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto flex min-h-[90vh] max-w-7xl flex-col items-center justify-center px-6 text-center">
        <span className="rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm text-green-400">
          Virtual Trading Platform
        </span>

        <h1 className="mt-8 max-w-5xl text-6xl font-bold leading-tight lg:text-8xl">
          Learn Trading.
          <span className="block text-green-400">
            Build Wealth Skills.
          </span>
        </h1>

        <p className="mt-8 max-w-2xl text-lg text-zinc-400">
          Practice investing with virtual money,
          compete on leaderboards, get AI insights,
          and master the stock market without risking real capital.
        </p>

        <div className="mt-10 flex gap-4">
          <Link
            href="/register"
            className="flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-semibold text-black"
          >
            Start Trading
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/dashboard"
            className="rounded-xl border border-white/10 px-6 py-3 hover:bg-white/5"
          >
            Demo Dashboard
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<TrendingUp size={28} />}
            title="Virtual Trading"
            description="Trade stocks using virtual money."
          />

          <FeatureCard
            icon={<Brain size={28} />}
            title="AI Mentor"
            description="Portfolio analysis and suggestions."
          />

          <FeatureCard
            icon={<Trophy size={28} />}
            title="Competitions"
            description="Battle investors and climb rankings."
          />

          <FeatureCard
            icon={<Shield size={28} />}
            title="Risk Free"
            description="Learn without losing real money."
          />
        </div>
      </section>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="mb-4 text-green-400">{icon}</div>

      <h3 className="mb-2 text-xl font-semibold">
        {title}
      </h3>

      <p className="text-zinc-400">
        {description}
      </p>
    </div>
  );
}