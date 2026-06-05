"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
} from "react";
import type { SafeUser } from "@/lib/session";
import { useAuthStore } from "@/stores/authStore";

const InitialUserContext = createContext<SafeUser | null>(null);

export function UserProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser?: SafeUser | null;
}) {
  const hydrate = useAuthStore((s) => s.hydrate);
  const seedUser = useAuthStore((s) => s.seedUser);

  useLayoutEffect(() => {
    if (initialUser) {
      const state = useAuthStore.getState();
      if (state.user?.id !== initialUser.id) {
        seedUser(initialUser);
      } else if (state.loading) {
        useAuthStore.setState({ loading: false, hasHydrated: true });
      }
      return;
    }

    const { user, hasHydrated } = useAuthStore.getState();
    if (user || hasHydrated) {
      useAuthStore.setState({ loading: false });
      return;
    }

    hydrate();
  }, [initialUser, seedUser, hydrate]);

  return (
    <InitialUserContext.Provider value={initialUser ?? null}>
      {children}
    </InitialUserContext.Provider>
  );
}

/** Store user, falling back to server-provided user for consistent SSR/hydration. */
export function useDisplayUser() {
  const storeUser = useAuthStore((s) => s.user);
  const initialUser = useContext(InitialUserContext);
  return storeUser ?? initialUser ?? null;
}

export function useUser() {
  const user = useDisplayUser();
  const loading = useAuthStore((s) => s.loading);
  const patchUser = useAuthStore((s) => s.patchUser);
  const hydrate = useAuthStore((s) => s.hydrate);
  const logoutStore = useAuthStore((s) => s.logout);

  const refresh = useCallback(async () => {
    await hydrate({ force: true });
  }, [hydrate]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    logoutStore();
    window.location.href = "/login";
  }, [logoutStore]);

  return { user, loading, refresh, logout, patchUser };
}

export function useAuth() {
  const user = useDisplayUser();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const loading = useAuthStore((s) => s.loading);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const hydrate = useAuthStore((s) => s.hydrate);
  const patchUser = useAuthStore((s) => s.patchUser);

  return {
    user,
    isAuthenticated: isAuthenticated || user != null,
    loading,
    login,
    logout,
    hydrate,
    patchUser,
  };
}
