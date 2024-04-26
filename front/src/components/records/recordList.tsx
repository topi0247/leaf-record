import { IRecord } from "@/types";
import Link from "next/link";
import { FaLock } from "react-icons/fa";

export default function RecordList({
  records = [],
  isLoading,
}: {
  records: IRecord[];
  isLoading: boolean;
}) {
  return (
    <ul className="flex flex-col gap-2  md:grid md:grid-cols-3">
      {records.length === 0 && !isLoading && (
        <li>
          <p>記録がありません</p>
        </li>
      )}
      {isLoading && (
        <li className="w-full h-[48px] animate-pulse">
          <div className="rounded h-full bg-slate-300 opacity-50 flex justify-center items-center">
            <p className="text-black text-center">読込中</p>
          </div>
        </li>
      )}
      {records.length > 0 &&
        records.map((record) => (
          <li key={record.name}>
            <Link
              href={`record/${record.name}`}
              className="bg-slate-300 text-black w-full px-4 py-2 rounded transition-all hover:bg-slate-700 hover:text-white text-xl flex flex-col h-18"
            >
              <div className="flex gap-2 items-center justify-start">
                <span>
                  <FaLock />
                </span>
                <span className="line-clamp-1">{record.name}</span>
              </div>
              <span className="text-end text-sm">
                作成日 {record.created_at}
              </span>
            </Link>
          </li>
        ))}
    </ul>
  );
}
