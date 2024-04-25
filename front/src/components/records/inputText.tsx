"use client";
import { authClient } from "@/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function InputText({
  setIsCreateRecord,
}: {
  setIsCreateRecord: (isCreated: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [validation, setValidation] = useState(false);
  const router = useRouter();

  const handleCreateRecord = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validation) {
      alert("英数字「-」「_」「.」半角スペースのみ使用可能です");
    }
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
    setIsCreateRecord(true);
    setName("");
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
    <form className="flex gap-2" onSubmit={handleCreateRecord}>
      <div className="relative flex flex-col gap-2">
        <input
          type="text"
          className="text-black p-2 rounded"
          onChange={handleSetName}
          value={name}
        />
        <span className="text-xs text-red-400 text-center w-full">
          英数字「 - 」「 _ 」「 . 」半角スペースのみ
        </span>
      </div>
      <div>
        <button
          type="submit"
          disabled={name.length === 0 || validation}
          className={`px-4 py-2 rounded transition-all hover:bg-gray-500 ${
            name.length === 0 || validation
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
