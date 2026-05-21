import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import "./global.css";

import { useAuth } from "@/hooks/useAuth";

export default function RootLayout() {
  const { restoreSession, loading, isAuthenticated } = useAuth();

  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    restoreSession();
  }, []);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/sign-in");
    }

    if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [loading, isAuthenticated, segments]);

  if (loading) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
