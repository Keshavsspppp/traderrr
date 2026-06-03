"use client";

import { InputHTMLAttributes } from "react";

interface Props
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function FloatingInput({
  label,
  ...props
}: Props) {
  return (
    <div className="relative">
      <input
        {...props}
        placeholder=" "
        className="
          peer
          w-full
          rounded-xl
          border
          border-zinc-700
          bg-zinc-900/60
          px-4
          pt-6
          pb-2
          outline-none
          focus:border-green-500
        "
      />

      <label
        className="
          absolute
          left-4
          top-2
          text-sm
          text-zinc-400
          transition-all
          peer-placeholder-shown:top-4
          peer-placeholder-shown:text-base
          peer-focus:top-2
          peer-focus:text-sm
          peer-focus:text-green-400
        "
      >
        {label}
      </label>
    </div>
  );
}