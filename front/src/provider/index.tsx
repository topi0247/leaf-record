"use client";
import { ReactNode } from "react";
import { AppStateProvider } from "@/store";

export default function AppProvider({ children }: { children: ReactNode }) {
  return <AppStateProvider>{children}</AppStateProvider>;
}
