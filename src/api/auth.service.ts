import { api } from "./axios";

import { User, UserLogin, UserRegister } from "@/types/user";

export const authService = {
  async signIn(data: UserLogin): Promise<User> {
    const response = await api.post<User>("/users/sign-in", data);

    return response.data;
  },

  async signUp(data: UserRegister): Promise<User> {
    const response = await api.post<User>("/users/sign-up", data);

    return response.data;
  },

  async auth(): Promise<User> {
    const response = await api.post<User>("/users/auth");

    return response.data;
  },
};
