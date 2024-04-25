"use client";
import { useAuth } from "@/api";
import { InputText, RecordList } from "@/components/records";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function UserPage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [isCreateRecord, setIsCreateRecord] = useState(false);

  const fetchData = useCallback(async () => {
    const queryParams = new URLSearchParams(window.location.search);
    const uid = queryParams.get("uid");
    const client = queryParams.get("client");
    const token = queryParams.get("token");
    const expiry = queryParams.get("expiry");
    let logged = false;
    if (uid && client && token && expiry) {
      currentUser({ uid, client, token, expiry }).then((res) => (logged = res));
      router.push("/record");
    } else {
      currentUser().then((res) => (logged = res));
    }
  }, [currentUser, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <article className="container m-auto my-8">
      <section className="flex items-center gap-3 justify-end">
        <h3 className="text-xl">新しい記録集を作る</h3>
        <InputText setIsCreateRecord={setIsCreateRecord} />
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">記録集一覧</h2>
        <RecordList
          isCreateRecord={isCreateRecord}
          setIsCreateRecord={setIsCreateRecord}
        />
      </section>
    </article>
  );
}
