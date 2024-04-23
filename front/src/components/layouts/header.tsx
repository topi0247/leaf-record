"use client";
import { useAuth } from "@/api";
import { userState } from "@/recoil";
import { Rampart_One } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";

const RampartOneFont = Rampart_One({
  weight: "400",
  subsets: ["latin"],
});

export default function Header() {
  const { currentUser, login, logout } = useAuth();
  const user = useRecoilValue(userState);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const logged = await currentUser().then((res) => res);
      if (logged) {
        router.push("/user");
      } else {
        router.push("/");
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container flex justify-between items-center m-auto">
      <h1 className={`text-3xl ${RampartOneFont.className}`}>
        <Link href="/">Leaf Record ～大草原不可避～</Link>
      </h1>
      <nav>
        <ul
          className={`grid ${
            user.id ? "grid-cols-2" : "grid-cols-1"
          } justify-center items-center text-center`}
        >
          {user.id ? (
            <>
              <li>
                <Link
                  href="/user"
                  className="p-4 flex justify-center items-center hover:bg-white hover:text-black transition-all"
                >
                  {user.name}
                </Link>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="p-4 flex justify-center items-center hover:bg-white hover:text-black transition-all"
                >
                  ログアウト
                </button>
              </li>
            </>
          ) : (
            <li>
              <button
                onClick={login}
                className="p-4 flex justify-center items-center hover:bg-white hover:text-black transition-all"
              >
                ログイン
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
