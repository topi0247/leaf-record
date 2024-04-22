"use client";
import { authClient } from "@/api";
import { userState } from "@/recoil";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

interface Record {
  id: number;
  name: string;
}

export default function UserPage() {
  const user = useRecoilValue(userState);
  const [name, setName] = useState("");
  const [records, setRecords] = useState([] as Record[]);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    const res = await authClient.get("/records");
    if (res.status !== 200) {
    }
    console.log(res.data);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateRecord = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await authClient.post("/records", { repository_name: name });
    console.log(res);
  };

  return (
    <article className="container m-auto my-8">
      <section className="flex items-center justify-end gap-3">
        <h3 className="text-xl">新しい記録集を作る</h3>
        <form className="flex gap-2" onSubmit={handleCreateRecord}>
          <input
            type="text"
            className="text-black px-2 rounded"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <button
            type="submit"
            disabled={name.length === 0}
            className={`px-4 py-2 rounded transition-all hover:bg-gray-400 ${
              name.length === 0
                ? "bg-gray-500 text-gray-800"
                : "bg-white text-black"
            }`}
          >
            作成
          </button>
        </form>
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">記録一覧</h2>
        {records.length === 0 ? (
          <p>記録がありません</p>
        ) : (
          <ul>
            {records.map((record) => (
              <li key={record.id}>
                <p>{record.name}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}
