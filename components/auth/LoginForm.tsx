"use client";

import Link from "next/link";

export default function LoginForm() {
  return (
    <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-8">
      <h2 className="text-3xl font-bold mb-2">
        Welcome Back
      </h2>

      <p className="text-zinc-400 mb-8">
        Sign in to continue trading.
      </p>

      <form className="space-y-5">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800"
        />

        <button
          className="w-full bg-green-500 hover:bg-green-600 transition p-4 rounded-xl font-semibold"
        >
          Login
        </button>
      </form>

      <p className="mt-6 text-center text-zinc-400">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="text-green-400"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}