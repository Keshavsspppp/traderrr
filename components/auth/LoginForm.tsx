"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Login failed");
        return;
      }
      toast.success("Welcome back!");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
      <h2 className="mb-2 text-3xl font-bold">Welcome Back</h2>
      <p className="mb-8 text-zinc-400">Sign in to continue trading.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-4"
        />
        <input
          type="password"
          placeholder="Password"
          {...register("password")}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-4"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-green-500 p-4 font-semibold text-black transition hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
      {errors.email && (
        <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>
      )}
      {errors.password && (
        <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>
      )}
      <p className="mt-6 text-center text-zinc-400">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-green-400">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
