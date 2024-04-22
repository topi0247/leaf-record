"use client";
import { IUser } from "@/types";
import { atom } from "recoil";

export const userState = atom<IUser>({
  key: "userState",
  default: {
    id: null as number | null,
    name: null as string | null,
  },
});
