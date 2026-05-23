import { api } from "./axios";

import type {
  User,
  UserChangePassword,
  UserDataItem,
  UserRegister,
  UserUpdate,
} from "@/types/user";

// obtener usuario
export async function getUserById(id: string): Promise<UserDataItem | null> {
  try {
    const res = await api.get(`/users/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error obteniendo usuario ${id}`, error);

    return null;
  }
}

// actualizar usuario
export async function updateUser(
  id: string,
  user: UserUpdate,
): Promise<number> {
  try {
    const res = await api.put(`/users/${id}`, user);

    return res.status;
  } catch (error) {
    console.error("Error actualizando usuario", error);

    return 400;
  }
}

// login
export async function getUserForLogin(
  email: string,
  password: string,
): Promise<User | null> {
  try {
    const res = await api.post(`/users/sign-in`, {
      email,
      password,
    });

    return res.data.data;
  } catch (error) {
    console.error(error);

    return null;
  }
}

// registro
export async function createUser(user: UserRegister): Promise<number> {
  try {
    const res = await api.post("/users/sign-up", {
      ...user,
      role: 0,
    });

    return res.status;
  } catch (error) {
    console.error(error);

    return 400;
  }
}

// cambiar password
export async function changePassword(
  user: UserChangePassword,
): Promise<number> {
  try {
    const res = await api.patch(`/users/${user.id}/password`, {
      password: user.password,
    });

    return res.status;
  } catch (error) {
    console.error(error);

    return 400;
  }
}
