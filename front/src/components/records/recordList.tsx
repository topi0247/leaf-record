"use client";

import { authClient } from "@/api";
import { Record } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaLock } from "react-icons/fa";

export default function RecordList({
  isCreateRecord,
  setIsCreateRecord,
}: {
  isCreateRecord: boolean;
  setIsCreateRecord: (isCreateRecord: boolean) => void;
}) {
  const [records, setRecords] = useState<Record[]>([]);

  useEffect(() => {
    const fetchRecords = async () => {
      const res = await authClient.get("/records");

      if (res.data.success === false) {
        alert(res.data.message);
        return;
      }

      setRecords(res.data);
    };

    fetchRecords();
    setIsCreateRecord(false);
  }, [isCreateRecord]);

  return (
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
            <span className="text-end text-sm">作成日 {record.created_at}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
