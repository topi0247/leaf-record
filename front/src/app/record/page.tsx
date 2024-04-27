"use client";
import { authClient, useAuth } from "@/api";
import { CreateRecord, RecordList } from "@/components/records";
import { recordsState, userState } from "@/recoil";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import * as Shadcn from "@/components/shadcn";

export default function UserPage() {
  const user = useRecoilValue(userState);
  const { currentUser, autoLogin } = useAuth();
  const router = useRouter();
  const [records, setRecords] = useRecoilState(recordsState);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    if (user.id) return;

    const queryParams = new URLSearchParams(window.location.search);
    const uid = queryParams.get("uid");
    const client = queryParams.get("client");
    const token = queryParams.get("token");
    const expiry = queryParams.get("expiry");
    let logged = false;
    try {
      setIsLoading(true);
      if (uid && client && token && expiry) {
        await currentUser({ uid, client, token, expiry }).then(
          (res) => (logged = res)
        );
        if (logged) {
          router.push("/record");
        }
      } else {
        await autoLogin().then((res) => (logged = res));
      }
      if (!logged) {
        router.push("/");
      }
    } catch (e) {
      alert("エラーが発生しました");
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchRecords = useCallback(async () => {
    if (records.length > 0) return;
    try {
      setIsLoading(true);
      const res = await authClient.get("/records");
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
    setIsLoading(false);
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
