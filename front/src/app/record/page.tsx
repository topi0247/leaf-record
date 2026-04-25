"use client";
import { authFetch, useAuth } from "@/api";
import { CreateRecord, RecordList } from "@/components/records";
import { useUserState, useRecordsState } from "@/store";
import type { IRecord } from "@/types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import * as Shadcn from "@/components/shadcn";

export default function UserPage() {
  const user = useUserState();
  const { autoLogin } = useAuth();
  const router = useRouter();
  const [records, setRecords] = useRecordsState();
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    if (user.id) return;
    try {
      const logged = await autoLogin();
      if (!logged) router.push("/");
    } catch (e) {
      alert("エラーが発生しました");
      router.push("/");
    }
  }, []);

  const fetchRecords = useCallback(async () => {
    if (records.length > 0) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const res = await authFetch<IRecord[]>("/records");
      if (res.status !== 200) {
        alert("エラーが発生しました");
        return;
      }

      if (res.data.length === 0) {
        setRecords([]);
        return;
      }
      setRecords(res.data);
    } catch (e) {
      alert("エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return (
    <article className="container m-auto mt-4 md:mt-8">
      <section className="flex flex-col md:flex-row items-start gap-3 justify-end">
        <h3 className="text-xl">新しいリポジトリを作る</h3>
        <CreateRecord isLoading={isLoading} setIsLoading={setIsLoading} />
      </section>
      <hr className="my-4 border-slate-500 md:hidden" />
      <Shadcn.Skeleton className="w-full rounded h-18" />
      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">記録集一覧</h2>
        <RecordList records={records} isLoading={isLoading} />
      </section>
    </article>
  );
}
