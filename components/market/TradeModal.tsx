"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { formatCurrency } from "@/lib/format";

interface TradeModalProps {
  open: boolean;
  symbol: string;
  price: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TradeModal({
  open,
  symbol,
  price,
  onClose,
  onSuccess,
}: TradeModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [type, setType] = useState<"BUY" | "SELL">("BUY");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const total = price * quantity;

  const submit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, quantity, type }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Trade failed");
        return;
      }
      toast.success(`${type} order executed`);
      onSuccess();
      onClose();
    } catch {
      toast.error("Trade failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950 p-6">
        <h2 className="text-2xl font-bold">Trade {symbol}</h2>
        <p className="mt-1 text-zinc-400">Price: {formatCurrency(price)}</p>

        <div className="mt-6 flex gap-2">
          {(["BUY", "SELL"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`flex-1 rounded-xl py-2 font-medium ${
                type === t
                  ? t === "BUY"
                    ? "bg-green-500 text-black"
                    : "bg-red-500 text-white"
                  : "bg-white/5 text-zinc-400"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <label className="mt-6 block text-sm text-zinc-400">Quantity</label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 p-3"
        />

        <p className="mt-4 text-lg">
          Total: <span className="font-bold text-green-400">{formatCurrency(total)}</span>
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/10 py-3"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={loading}
            className="flex-1 rounded-xl bg-green-500 py-3 font-semibold text-black disabled:opacity-50"
          >
            {loading ? "Processing..." : `Confirm ${type}`}
          </button>
        </div>
      </div>
    </div>
  );
}
