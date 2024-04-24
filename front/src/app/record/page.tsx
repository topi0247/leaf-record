"use client";
import { authClient, useAuth } from "@/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FaLock } from "react-icons/fa";

interface Record {
  name: string;
  description: string;
  private: boolean;
  created_at: string;
}

export default function UserPage() {
  const { currentUser } = useAuth();
  const [name, setName] = useState("");
  const [records, setRecords] = useState([] as Record[]);
  const router = useRouter();
  const [validation, setValidation] = useState(false);

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

    const res = await authClient.get("/records");
    if (res.status === 500) {
      alert("エラーが発生しました");
      return;
    } else if (res.status === 401) {
      alert("ログインしてください");
      router.push("/");
      return;
    }
    setRecords(res.data);
  }, [currentUser, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateRecord = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await authClient.post("/records", { repository_name: name });
    if (res.status === 500) {
      alert("エラーが発生しました");
      return;
    } else if (res.status === 401) {
      alert("ログインしてください");
      router.push("/");
      return;
    }

    alert(res.data.message);
    if (res.data.success) {
      await fetchData();
      setName("");
      return;
    }
  };

  const handleSetName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (!/^[a-zA-Z0-9-_\. ]+$/.test(e.target.value)) {
      setValidation(true);
    } else {
      setValidation(false);
    }
  };

  return (
    <article className="container m-auto my-8">
      <section className="flex items-center gap-3 justify-end">
        <h3 className="text-xl">新しい記録集を作る</h3>
        <form className="flex gap-2" onSubmit={handleCreateRecord}>
          <div className="relative">
            <input
              type="text"
              className="text-black p-2 rounded"
              onChange={handleSetName}
              value={name}
            />
            {name && validation && (
              <span className="absolute left-0 -bottom-7 text-xs text-red-400 text-center w-full">
                英数字「-」「_」「.」半角スペースのみ
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={name.length === 0}
            className={`px-4 py-2 rounded transition-all hover:bg-gray-500 ${
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
        <h2 className="text-xl font-semibold">記録集一覧</h2>
        {records.length === 0 ? (
          <p>記録がありません</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {records.map((record, index) => (
              <li key={index}>
                <Link
                  href={`record/${record.name}`}
                  className="bg-slate-300 text-black w-full px-4 py-2 rounded transition-all hover:bg-slate-400 text-xl flex flex-col"
                >
                  <div className="flex gap-2 items-center justify-start">
                    {record.private && (
                      <span>
                        <FaLock />
                      </span>
                    )}
                    <span>{record.name}</span>
                  </div>
                  <span className="text-gray-500 ml-5 text-sm">
                    {record.description}
                  </span>
                  <span className="text-end text-sm">
                    作成日 {record.created_at}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}
