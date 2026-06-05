import { create } from "zustand";
import type { SafeUser } from "@/lib/session";

type AuthState = {
  user: SafeUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: SafeUser | null) => void;
  setLoading: (loading: boolean) => void;
  login: (user: SafeUser) => void;
  logout: () => void;
  hydrate: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  setUser: (user) =>
    set({ user, isAuthenticated: user != null, loading: false }),

  setLoading: (loading) => set({ loading }),

  login: (user) =>
    set({ user, isAuthenticated: true, loading: false }),

  logout: () =>
    set({ user: null, isAuthenticated: false, loading: false }),

  hydrate: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        set({ user: data.user, isAuthenticated: true, loading: false });
      } else {
        set({ user: null, isAuthenticated: false, loading: false });
      }
    } catch {
      set({ user: null, isAuthenticated: false, loading: false });
    }
  },
}));
