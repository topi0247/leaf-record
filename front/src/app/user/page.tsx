"use client";
import { userState } from "@/recoil";
import { useRecoilValue } from "recoil";

export default function UserPage() {
  const user = useRecoilValue(userState);
  return <article className=""></article>;
}
