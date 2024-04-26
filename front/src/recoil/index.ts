"use client";
import { IUser, IRecord } from "@/types";
import { atom } from "recoil";

export const userState = atom<IUser>({
  key: "userState",
  default: {
    id: null as number | null,
    name: null as string | null,
  },
});

export const recordsState = atom<IRecord[]>({
  key: "recordsState",
  default: [],
});
