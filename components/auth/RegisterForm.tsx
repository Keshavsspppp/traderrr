"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FloatingInput from "./FloatingInput";
import PasswordStrength from "./PasswordStrength";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { registerSchema } from "@/lib/validations/auth";
import { useAuthStore } from "@/stores/authStore";

type FormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password", "");

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Registration failed");
        return;
      }
      if (json.user) {
        useAuthStore.getState().login(json.user);
      }
      toast.success("Account created!");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <FloatingInput label="Full Name" {...register("name")} />
      <FloatingInput label="Email" type="email" {...register("email")} />
      <div className="relative">
        <FloatingInput
          label="Password"
          type={show ? "text" : "password"}
          {...register("password")}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 top-4"
        >
          {show ? <EyeOff /> : <Eye />}
        </button>
      </div>
      <PasswordStrength password={password} />
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-green-500 py-3 font-semibold text-black hover:bg-green-600 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Account"}
      </button>
      {errors.name && (
        <p className="text-sm text-red-500">{errors.name.message}</p>
      )}
      {errors.email && (
        <p className="text-sm text-red-500">{errors.email.message}</p>
      )}
      {errors.password && (
        <p className="text-sm text-red-500">{errors.password.message}</p>
      )}
    </form>
  );
}
