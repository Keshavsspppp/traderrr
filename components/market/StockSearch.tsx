"use client";

import { Search } from "lucide-react";

export default function StockSearch() {
  return (
    <div
      className="
        flex
        items-center
        gap-3
        rounded-3xl
        border
        border-white/10
        bg-white/5
        p-4
        backdrop-blur-xl
      "
    >
      <Search
        size={20}
        className="text-zinc-400"
      />

      <input
        type="text"
        placeholder="Search stocks..."
        className="
          w-full
          bg-transparent
          outline-none
          placeholder:text-zinc-500
        "
      />
    </div>
  );
}