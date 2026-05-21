import { authService } from "@/api/auth.service";

import { authStorage } from "@/storage/auth.storage";

import { useAuthStore } from "@/store/auth.store";

import { UserLogin, UserRegister } from "@/types/user";

export function useAuth() {
  const { user, setUser, loading, setLoading } = useAuthStore();

  async function signIn(data: UserLogin) {
    const user = await authService.signIn(data);

    await authStorage.saveSession(user);

    setUser(user);

    return user;
  }

  async function signUp(data: UserRegister) {
    const user = await authService.signUp(data);

    await authStorage.saveSession(user);

    setUser(user);

    return user;
  }

  async function logout() {
    await authStorage.clearSession();

    setUser(null);
  }

  async function restoreSession() {
    try {
      setLoading(true);

      const user = await authService.auth();

      await authStorage.saveSession(user);

      setUser(user);
    } catch {
      await authStorage.clearSession();

      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  return {
    user,
    loading,
    isAuthenticated: !!user,

    signIn,
    signUp,
    logout,
    restoreSession,
  };
}
