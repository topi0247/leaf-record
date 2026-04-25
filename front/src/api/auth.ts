import { useSetUserState } from "@/store";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION;
const API_URL = `${BASE_API_URL}/api/${API_VERSION}`;

interface FetchOptions extends Omit<RequestInit, "headers"> {
  headers?: Record<string, string>;
}

interface AuthResponse {
  success: boolean;
  user: { id: number; name: string };
}

export async function authFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<{ status: number; data: T }> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}

async function baseFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<{ status: number; data: T }> {
  const res = await fetch(`${BASE_API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}

export const useAuth = () => {
  const setUser = useSetUserState();

  async function login(): Promise<void> {
    window.location.href = `${BASE_API_URL}/auth/github`;
  }

  async function autoLogin(): Promise<boolean> {
    const res = await authFetch<AuthResponse>("/me");
    if (res.status !== 200) return false;
    if (!res.data.success) return false;
    setUser({ id: res.data.user.id, name: res.data.user.name });
    return true;
  }

  async function logout(): Promise<boolean> {
    const res = await baseFetch<null>("/auth/sign_out", { method: "DELETE" });
    if (res.status !== 200) return false;
    setUser({ id: null, name: "" });
    return true;
  }

  return { login, autoLogin, logout };
};
