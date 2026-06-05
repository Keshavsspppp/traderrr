import { create } from "zustand";
import type { SafeUser } from "@/lib/session";

type AuthState = {
  user: SafeUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  hasHydrated: boolean;
  setUser: (user: SafeUser | null) => void;
  setLoading: (loading: boolean) => void;
  seedUser: (user: SafeUser) => void;
  patchUser: (patch: Partial<SafeUser>) => void;
  login: (user: SafeUser) => void;
  logout: () => void;
  hydrate: (options?: { force?: boolean }) => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: true,
  hasHydrated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: user != null,
      loading: false,
    }),

  setLoading: (loading) => set({ loading }),

  seedUser: (user) =>
    set({
      user,
      isAuthenticated: true,
      loading: false,
      hasHydrated: true,
    }),

  patchUser: (patch) => {
    const current = get().user;
    if (!current) return;
    set({ user: { ...current, ...patch } });
  },

  login: (user) =>
    set({
      user,
      isAuthenticated: true,
      loading: false,
      hasHydrated: true,
    }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      loading: false,
      hasHydrated: false,
    }),

  hydrate: async (options) => {
    const { force = false } = options ?? {};
    const state = get();

    if (state.hasHydrated && !force) {
      set({ loading: false });
      return;
    }

    if (state.user && !force) {
      set({ hasHydrated: true, loading: false });
      return;
    }

    set({ loading: true });

    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = (await res.json()) as { user: SafeUser };
        set({
          user: data.user,
          isAuthenticated: true,
          loading: false,
          hasHydrated: true,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          loading: false,
          hasHydrated: true,
        });
      }
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        hasHydrated: true,
      });
    }
  },
}));
