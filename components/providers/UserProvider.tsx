"use client";

import { useCallback, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return <>{children}</>;
}

export function useUser() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const hydrate = useAuthStore((s) => s.hydrate);
  const logoutStore = useAuthStore((s) => s.logout);

  const refresh = useCallback(async () => {
    await hydrate();
  }, [hydrate]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    logoutStore();
    window.location.href = "/login";
  }, [logoutStore]);

  return { user, loading, refresh, logout };
}

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const loading = useAuthStore((s) => s.loading);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const hydrate = useAuthStore((s) => s.hydrate);

  return { user, isAuthenticated, loading, login, logout, hydrate };
}
