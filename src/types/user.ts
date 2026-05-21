export type UserRole = "CLIENTE" | "ADMINISTRADOR";

export type User = {
  id: string;
  name: string;
  email: string;
  physical_address: string;
  role: UserRole;
  token: string;
};

export type UserLogin = {
  email: string;
  password: string;
};

export type UserRegister = {
  name: string;
  email: string;
  physical_address: string;
  password: string;
  role?: UserRole;
};

export type UserUpdate = {
  name: string;
  email: string;
  physical_address: string;
};

export type UserChangePassword = {
  id: string;
  password: string;
};

export type UserDataItem = Omit<User, "token">;

export type PaginatedUsers = {
  total: number;
  pages: number;
  first: number;
  next: number | null;
  prev: number | null;
  data: UserDataItem[];
};
