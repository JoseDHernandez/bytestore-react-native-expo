import { create } from "zustand";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthStore = {
  token: string | null;
  user: User | null;
  setSession: (token: string, user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  user: null,

  setSession: (token, user) =>
    set({
      token,
      user,
    }),

  logout: () =>
    set({
      token: null,
      user: null,
    }),
}));
