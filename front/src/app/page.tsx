"use client";
import { useAuth } from "@/api";
import { userState } from "@/recoil";
import { Rampart_One } from "next/font/google";
import Link from "next/link";
import { useEffect } from "react";
import { FaGithub } from "react-icons/fa";
import { useRecoilValue } from "recoil";

const RampartOneFont = Rampart_One({
  weight: "400",
  subsets: ["latin"],
});

export default function Home() {
  const { login, autoLogin } = useAuth();
  const user = useRecoilValue(userState);

  useEffect(() => {
    const fetchData = async () => {
      await autoLogin();
    };

    if (!user.id) {
      fetchData();
    }
  }, [user]);

  return (
    <article className="flex flex-col gap-12 justify-center items-center m-8 md:mx-auto md:mt-16">
      <div className="justify-center flex flex-col gap-3 md:gap-6 md:justify-between items-center">
        <h2
          className={`${RampartOneFont.className} text-5xl md:text-6xl text-center flex flex-col`}
        >
          Leaf Record<span className="text-4xl">～大草原不可避～</span>
        </h2>
        <p className="text-xl md:text-2xl tracking-widest">
          GitHub<span className="text-green-400">緑化</span>大作戦
        </p>
      </div>
      <section className="flex flex-col gap-5">
        <h3 className="text-center text-xl">
          <span className="border-b-2 border-slate-400 px-4 pb-1 rounded">
            どんなアプリ？
          </span>
        </h3>
        <p>
          記録した内容がまるっと
          <br className="md:hidden" />
          プライベートリポジトリに反映されます。
          <br />
          記録を取れば取るほど、
          <br className="md:hidden" />
          あなたのGitHubが大草原に！！
        </p>
      </section>
      <section className="flex flex-col gap-5 mb:28">
        <h3 className="text-center text-xl">
          <span className="border-b-2 border-slate-400 px-4 pb-1 rounded">
            さっそく使ってみよう！
          </span>
        </h3>
        <div className="m-auto">
          {user.id ? (
            <Link
              href="/record"
              className="flex justify-center items-center gap-1 p-4 bg-gray-700 text-white rounded hover:bg-gray-600 transition-all"
            >
              <span className="text-green-300">草</span>を生やしに行く
            </Link>
          ) : (
            <button
              onClick={login}
              className="flex justify-center items-center gap-1 p-4 bg-gray-700 text-white rounded hover:bg-gray-600 transition-all"
            >
              <FaGithub className="text-xl" />
              GitHubでログインする
            </button>
          )}
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
      <section className="flex flex-col gap-5">
        <p className="text-center">
          え？記録をシェアしたい？
          <br />
          日記として使いたい？
          <br />
          面白い色んな機能がほしい？
          <br />
          そんなあなたにオススメなのは
        </p>
        <h3 className="text-center text-xl my-4">
          <a
            href="https://chiikusa-diary.fly.dev"
            target="_blank"
            className="border-b-2 border-green-400 px-4 pb-1 rounded text-green-400"
          >
            ちいくさ日記
          </a>
        </h3>
        <p className="text-center">↑リンクから触ってみよう！</p>
        <p>※外部アプリです。開発者・管理者が異なります。</p>
      </section>
    </article>
  );
}
