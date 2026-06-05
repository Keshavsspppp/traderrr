"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck, TrendingDown, TrendingUp, Trophy } from "lucide-react";
import toast from "react-hot-toast";

type NotificationItem = {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
};

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return new Date(date).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

function TypeIcon({ type }: { type: string }) {
  if (type === "achievement") return <Trophy size={16} className="text-amber-400" />;
  if (type === "order") return <TrendingDown size={16} className="text-blue-400" />;
  return <TrendingUp size={16} className="text-green-400" />;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications ?? []);
      setUnreadCount(data.unreadCount ?? 0);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30_000);
    return () => clearInterval(interval);
  }, [load]);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const toggle = async () => {
    const next = !open;
    setOpen(next);
    if (next) {
      setLoading(true);
      await load();
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    const res = await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
    if (res.ok) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success("All notifications marked read");
    }
  };

  const markRead = async (id: string) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const onNotificationClick = async (n: NotificationItem) => {
    if (!n.read) await markRead(n.id);
    setOpen(false);
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={toggle}
        aria-label="Notifications"
        aria-expanded={open}
        className="relative rounded-xl border border-white/10 bg-white/5 p-2.5 hover:bg-white/10 sm:p-3"
      >
        <Bell size={18} className="sm:h-5 sm:w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-green-500 px-1 text-[10px] font-bold text-black">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,360px)] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300"
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[min(60vh,400px)] overflow-y-auto">
            {loading ? (
              <p className="p-6 text-center text-sm text-zinc-500">Loading…</p>
            ) : notifications.length === 0 ? (
              <p className="p-6 text-center text-sm text-zinc-500">
                No notifications yet. Trade or earn achievements to get updates.
              </p>
            ) : (
              <ul>
                {notifications.map((n) => {
                  const content = (
                    <div
                      className={`flex gap-3 px-4 py-3 transition hover:bg-white/5 ${
                        !n.read ? "bg-green-500/5" : ""
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        <TypeIcon type={n.type} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-zinc-400">
                          {n.message}
                        </p>
                        <p className="mt-1 text-[10px] text-zinc-600">
                          {timeAgo(n.createdAt)}
                        </p>
                      </div>
                      {!n.read && (
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-green-400" />
                      )}
                    </div>
                  );

                  return (
                    <li key={n.id} className="border-b border-white/5 last:border-0">
                      {n.link ? (
                        <Link href={n.link} onClick={() => onNotificationClick(n)}>
                          {content}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          className="w-full text-left"
                          onClick={() => onNotificationClick(n)}
                        >
                          {content}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
