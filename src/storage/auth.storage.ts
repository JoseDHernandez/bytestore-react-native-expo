import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import { User } from "@/types/user";

const SESSION_KEY = "auth_session";

async function save(key: string, value: string) {
  if (Platform.OS === "web") {
    return AsyncStorage.setItem(key, value);
  }

  return SecureStore.setItemAsync(key, value);
}

async function get(key: string) {
  if (Platform.OS === "web") {
    return AsyncStorage.getItem(key);
  }

  return SecureStore.getItemAsync(key);
}

async function remove(key: string) {
  if (Platform.OS === "web") {
    return AsyncStorage.removeItem(key);
  }

  return SecureStore.deleteItemAsync(key);
}

export const authStorage = {
  async saveSession(user: User) {
    await save(SESSION_KEY, JSON.stringify(user));
  },

  async getSession() {
    const session = await get(SESSION_KEY);

    return session ? (JSON.parse(session) as User) : null;
  },

  async getToken() {
    const session = await this.getSession();

    return session?.token ?? null;
  },

  async clearSession() {
    await remove(SESSION_KEY);
  },
};
