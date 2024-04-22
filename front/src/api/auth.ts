import { userState } from "@/recoil";
import axios from "axios";
import { useSetRecoilState } from "recoil";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION;
const API_URL = `${BASE_API_URL}/api/${API_VERSION}`;

const baseClient = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const authClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

authClient.interceptors.request.use((config) => {
  config.headers["access-token"] = localStorage.getItem("access-token");
  config.headers.client = localStorage.getItem("client");
  config.headers.uid = localStorage.getItem("uid");
  config.headers.expiry = localStorage.getItem("expiry");
  return config;
});

export const useAuth = () => {
  const setUser = useSetRecoilState(userState);

  // GitHubでログイン
  async function login(): Promise<void> {
    window.location.href = `${BASE_API_URL}/auth/github`;
  }

  // 現在ユーザーの取得
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
      localStorage.setItem("access-token", token);
      localStorage.setItem("client", client);
      localStorage.setItem("uid", uid);
      localStorage.setItem("expiry", expiry);
    }
    try {
      const res = await authClient.get("/me");
      if (res.status !== 200) {
        throw new Error("認証エラー");
      }

      const data = res.data;
      if (!data.success) {
        // サーバー側での処理失敗
        return false;
      }

      setUser({ id: data.user.id, name: data.user.name });
      return true;
    } catch (e: any) {
      return false;
    }
  }

  // ログアウト
  async function logout(): Promise<boolean> {
    try {
      const res = await baseClient.delete("/auth/sign_out", {
        headers: {
          "access-token": localStorage.getItem("access-token"),
          client: localStorage.getItem("client"),
          uid: localStorage.getItem("uid"),
          expiry: localStorage.getItem("expiry"),
        },
      });
      if (res.status !== 200) {
        throw new Error("認証エラー");
      }

      localStorage.removeItem("access-token");
      localStorage.removeItem("client");
      localStorage.removeItem("uid");
      localStorage.removeItem("expiry");

      setUser({ id: null, name: "" });
      return true;
    } catch (e: any) {
      console.error(e);
      return false;
    }
  }

  return {
    login,
    currentUser,
    logout,
  };
};
