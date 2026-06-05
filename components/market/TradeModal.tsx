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

type OrderKind = "MARKET" | "LIMIT" | "STOP_LOSS";

export default function TradeModal({
  open,
  symbol,
  price,
  onClose,
  onSuccess,
}: TradeModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [type, setType] = useState<"BUY" | "SELL">("BUY");
  const [orderType, setOrderType] = useState<OrderKind>("MARKET");
  const [limitPrice, setLimitPrice] = useState(price);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const effectivePrice = orderType === "MARKET" ? price : limitPrice;
  const total = effectivePrice * quantity;

  const submit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol,
          quantity,
          type,
          orderType,
          limitPrice: orderType === "MARKET" ? undefined : limitPrice,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Order failed");
        return;
      }
      if (json.immediate) {
        toast.success(`${type} order filled at market`);
      } else {
        toast.success(
          `${orderType.replace("_", " ")} order placed — fills when price is reached`
        );
      }
      onSuccess();
      onClose();
    } catch {
      toast.error("Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-white/10 bg-zinc-950 p-5 sm:max-w-md sm:rounded-3xl sm:p-6">
        <h2 className="text-2xl font-bold">Trade {symbol}</h2>
        <p className="mt-1 text-zinc-400">Market: {formatCurrency(price)}</p>

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

        <label className="mt-6 block text-sm text-zinc-400">Order type</label>
        <div className="mt-2 flex gap-2">
          {(
            [
              ["MARKET", "Market"],
              ["LIMIT", "Limit"],
              ["STOP_LOSS", "Stop"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setOrderType(value);
                if (value !== "MARKET") setLimitPrice(price);
              }}
              className={`flex-1 rounded-xl py-2 text-sm font-medium ${
                orderType === value
                  ? "bg-white/15 text-white"
                  : "bg-white/5 text-zinc-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {orderType !== "MARKET" && (
          <>
            <label className="mt-4 block text-sm text-zinc-400">
              {orderType === "LIMIT" ? "Limit price" : "Stop price"}
            </label>
            <input
              type="number"
              min={0.01}
              step={0.01}
              value={limitPrice}
              onChange={(e) => setLimitPrice(Number(e.target.value))}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 p-3"
            />
            <p className="mt-2 text-xs text-zinc-500">
              {orderType === "LIMIT" && type === "BUY" && "Buys when price ≤ limit"}
              {orderType === "LIMIT" && type === "SELL" && "Sells when price ≥ limit"}
              {orderType === "STOP_LOSS" && type === "SELL" && "Sells when price ≤ stop"}
              {orderType === "STOP_LOSS" && type === "BUY" && "Buys when price ≥ stop"}
            </p>
          </>
        )}

        <label className="mt-6 block text-sm text-zinc-400">Quantity</label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 p-3"
        />

        <p className="mt-4 text-lg">
          Est. total:{" "}
          <span className="font-bold text-green-400">{formatCurrency(total)}</span>
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
            {loading ? "Processing..." : `Place ${type}`}
          </button>
        </div>
      </div>
    </div>
  );
}
