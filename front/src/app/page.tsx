"use client";
import { useAuth } from "@/api";
import { Rampart_One } from "next/font/google";
import { FaGithub } from "react-icons/fa";
const RampartOneFont = Rampart_One({
  weight: "400",
  subsets: ["latin"],
});

export default function Home() {
  const { login } = useAuth();
  return (
    <article className="flex flex-col gap-12 justify-center items-center m-auto min-h-screen">
      <h2
        className={`${RampartOneFont.className} text-6xl flex flex-col justify-between items-center`}
      >
        Leaf Record<span>～大草原不可避～</span>
      </h2>
      <p className="text-2xl tracking-widest">GitHub緑化大作戦</p>
      <section className="flex flex-col gap-5">
        <h3 className="text-center text-xl">
          <span className="border-b-2 border-slate-400 px-4 pb-1 rounded">
            どんなアプリ？
          </span>
        </h3>
        <p className="leading-8">
          記録した内容がそのままプライベートリポジトリにコミット&プッシュされるアプリです。
          <br />
          記録を取れば取るほど、あなたのGitHubが大草原に！！
        </p>
      </section>
      <section className="flex flex-col gap-5">
        <h3 className="text-center text-xl">
          <span className="border-b-2 border-slate-400 px-4 pb-1 rounded">
            さっそく使ってみよう！
          </span>
        </h3>
        <div className="m-auto">
          <button
            onClick={login}
            className="flex justify-center items-center gap-1 p-4 bg-gray-700 text-white rounded hover:bg-gray-600 transition-all"
          >
            <FaGithub className="text-xl" />
            GitHubでログインする
          </button>
        </div>
        <div className="text-start text-sm">
          <p>
            アプリの仕様上、以下のアクセス権を使用させていただきます。
            <br />
            予めご了承くださいませ。
          </p>
          <ul className="list-disc ml-5 my-3">
            <li>ユーザープロフィールへのアクセス</li>
            <li>プライベートを含むリポジトリへのアクセスおよび操作</li>
          </ul>
        </div>
      </section>
    </article>
  );
}
