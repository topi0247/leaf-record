"use client";
import { authClient } from "@/api";
import { recordsState } from "@/recoil";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRecoilState } from "recoil";

export default function CreateRecord({
  isLoading,
  setIsLoading,
}: {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}) {
  const [recordName, setRecordName] = useState("");
  const [validation, setValidation] = useState(false);
  const router = useRouter();
  const [records, setRecords] = useRecoilState(recordsState);

  const handleCreateRecord = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validation) {
      alert("英数字「-」「_」「.」半角スペースのみ使用可能です");
      return;
    }
    try {
      setIsLoading(true);
      const res = await authClient.post("/records", {
        repository_name: recordName,
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (res.status === 500) {
        alert("エラーが発生しました");
        return;
      } else if (res.status === 401) {
        alert("ログインしてください");
        router.push("/");
        return;
      }

      alert(res.data.message);
      if (!res.data.success) return;

      setRecordName("");

      if (records?.length === 0) {
        setRecords([
          {
            name: recordName,
            description: "",
            private: true,
            created_at: new Date().toISOString(),
          },
        ]);
        return;
      }

      setRecords([
        {
          name: recordName,
          description: "",
          private: true,
          created_at: new Date().toISOString(),
        },
        ...records,
      ]);
    } catch (e) {
      alert("エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecordName(e.target.value);
    if (!/^[a-zA-Z0-9-_\. ]+$/.test(e.target.value)) {
      setValidation(true);
    } else {
      setValidation(false);
    }
  };

  return (
    <form className="flex gap-2" onSubmit={handleCreateRecord}>
      <div className="relative flex flex-col gap-2">
        <input
          type="text"
          className="text-black p-2 rounded"
          onChange={handleSetName}
          value={recordName}
        />
        <span className="text-xs text-red-400 text-center w-full">
          英数字「 - 」「 _ 」「 . 」半角スペースのみ
        </span>
      </div>
      <div>
        <button
          type="submit"
          disabled={recordName.length === 0 || validation}
          className={`px-4 py-2 rounded transition-all hover:bg-gray-500 ${
            recordName.length === 0 || validation
              ? "bg-gray-500 text-gray-800"
              : "bg-white text-black"
          }`}
        >
          作成
        </button>
      </div>
    </form>
  );
}
