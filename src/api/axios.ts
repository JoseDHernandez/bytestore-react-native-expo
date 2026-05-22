import { authStorage } from "@/storage/auth.storage";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL!;

const IMAGES_URL = process.env.EXPO_PUBLIC_IMAGES_URL!;

export const api = axios.create({
  baseURL: API_URL,
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

// transformar imágenes
api.interceptors.response.use((response) => {
  function replaceImageUrl(data: unknown): unknown {
    if (!data) return data;

    // array
    if (Array.isArray(data)) {
      return data.map(replaceImageUrl);
    }

    // object
    if (typeof data === "object" && data !== null) {
      const obj = data as Record<string, unknown>;

      const transformed = Object.fromEntries(
        Object.entries(obj).map(([key, value]) => {
          if (key === "image" && typeof value === "string") {
            return [key, value.replace("http://localhost:3000", API_URL)];
          }

          return [key, replaceImageUrl(value)];
        }),
      );

      return transformed;
    }

    return data;
  }

  response.data = replaceImageUrl(response.data);

  return response;
});
