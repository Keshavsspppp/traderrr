"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FloatingInput from "./FloatingInput";
import PasswordStrength from "./PasswordStrength";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const schema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
});

type FormData = z.infer<typeof schema>;

export default function RegisterForm() {
  const [show, setShow] = useState(false);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const password = watch("password", "");

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <FloatingInput
        label="Full Name"
        {...register("name")}
      />

      <FloatingInput
        label="Email"
        type="email"
        {...register("email")}
      />

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
        className="
          w-full
          rounded-xl
          bg-green-500
          py-3
          font-semibold
          hover:bg-green-600
        "
      >
        Create Account
      </button>

      {errors.email && (
        <p className="text-red-500 text-sm">
          Invalid Email
        </p>
      )}
    </form>
  );
}