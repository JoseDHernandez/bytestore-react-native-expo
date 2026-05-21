import { authStorage } from "@/storage/auth.storage";
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,

  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await authStorage.getToken();

  if (token) {
    config.headers.Authorization = token;
  }

  return config;
});
