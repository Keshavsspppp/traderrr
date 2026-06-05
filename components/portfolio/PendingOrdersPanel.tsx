"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { formatCurrency } from "@/lib/format";

type Order = {
  _id: string;
  stockSymbol: string;
  quantity: number;
  type: string;
  orderType: string;
  limitPrice: number;
  status: string;
};

export default function PendingOrdersPanel({ contestId }: { contestId?: string }) {
  const [orders, setOrders] = useState<Order[]>([]);

  const load = useCallback(async () => {
    const url = new URL("/api/orders", window.location.origin);
    if (contestId) url.searchParams.set("contestId", contestId);
    const res = await fetch(url.toString());
    if (res.ok) {
      const data = await res.json();
      setOrders(
        (data.orders ?? []).filter((o: Order) => o.status === "PENDING")
      );
    }
  }, [contestId]);

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [load]);

  const cancel = async (id: string) => {
    const url = new URL(`/api/orders/${id}`, window.location.origin);
    if (contestId) url.searchParams.set("contestId", contestId);
    const res = await fetch(url.toString(), { method: "DELETE" });
    if (res.ok) {
      toast.success("Order cancelled");
      load();
    }
  };

  if (orders.length === 0) return null;

  return (
    <div className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-6 backdrop-blur-xl">
      <h2 className="mb-4 text-lg font-semibold">Pending Orders</h2>
      <div className="space-y-2">
        {orders.map((o) => (
          <div
            key={o._id}
            className="flex items-center justify-between rounded-xl bg-black/20 px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium">
                {o.type} {o.quantity} × {o.stockSymbol}
              </p>
              <p className="text-xs text-zinc-400">
                {o.orderType.replace("_", " ")} @ {formatCurrency(o.limitPrice)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => cancel(o._id)}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Cancel
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
