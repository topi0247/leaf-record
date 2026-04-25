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

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const headers: Record<string, string> = {};
  const accessToken = localStorage.getItem("access-token");
  const client = localStorage.getItem("client");
  const uid = localStorage.getItem("uid");
  const expiry = localStorage.getItem("expiry");
  if (accessToken) headers["access-token"] = accessToken;
  if (client) headers["client"] = client;
  if (uid) headers["uid"] = uid;
  if (expiry) headers["expiry"] = expiry;
  return headers;
}

export async function authFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<{ status: number; data: T }> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
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
    if (res.status !== 200) {
      clearStorage();
      return false;
    }
    if (!res.data.success) {
      clearStorage();
      return false;
    }
    setUser({ id: res.data.user.id, name: res.data.user.name });
    return true;
  }

  async function currentUser({
    uid = "",
    client = "",
    token = "",
    expiry = "",
  }: {
    uid?: string;
    client?: string;
    token?: string;
    expiry?: string;
  } = {}): Promise<boolean> {
    if (uid && client && token && expiry) {
      setStorage({ accessToken: token, client, uid, expiry });
    }
    const res = await authFetch<AuthResponse>("/me");
    if (res.status !== 200) {
      clearStorage();
      return false;
    }
    if (!res.data.success) {
      clearStorage();
      return false;
    }
    setUser({ id: res.data.user.id, name: res.data.user.name });
    return true;
  }

  async function logout(): Promise<boolean> {
    const res = await baseFetch<null>("/auth/sign_out", {
      method: "DELETE",
      headers: {
        "access-token": localStorage.getItem("access-token") ?? "",
        client: localStorage.getItem("client") ?? "",
        uid: localStorage.getItem("uid") ?? "",
        expiry: localStorage.getItem("expiry") ?? "",
      },
    });
    if (res.status !== 200) {
      return false;
    }
    clearStorage();
    setUser({ id: null, name: "" });
    return true;
  }

  const setStorage = (data: {
    accessToken: string;
    client: string;
    uid: string;
    expiry: string;
  }) => {
    localStorage.setItem("access-token", data.accessToken);
    localStorage.setItem("client", data.client);
    localStorage.setItem("uid", data.uid);
    localStorage.setItem("expiry", data.expiry);
  };

  const clearStorage = () => {
    localStorage.removeItem("access-token");
    localStorage.removeItem("client");
    localStorage.removeItem("uid");
    localStorage.removeItem("expiry");
  };

  return { login, currentUser, logout, autoLogin };
};
