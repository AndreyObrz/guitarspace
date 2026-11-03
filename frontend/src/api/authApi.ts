import { http } from "./http";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export async function register(
  email: string,
  password: string,
  name?: string
): Promise<AuthResponse> {
  const { data } = await http.post<AuthResponse>("/auth/register", {
    email,
    password,
    name,
  });
  return data;
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const { data } = await http.post<AuthResponse>("/auth/login", {
    email,
    password,
  });
  return data;
}

export async function me(token: string): Promise<AuthUser> {
  const { data } = await http.get<AuthUser>("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}