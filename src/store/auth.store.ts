import { User } from "@/types/user";
import { create } from "zustand";

type AuthStore = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;

  setUser: (user: User | null) => void;

  setLoading: (loading: boolean) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  setLoading: (loading) => set({ loading }),
}));
