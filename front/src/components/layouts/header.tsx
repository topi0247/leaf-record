"use client";
import { useAuth } from "@/api";
import { userState } from "@/recoil";
import { Rampart_One } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

const RampartOneFont = Rampart_One({
  weight: "400",
  subsets: ["latin"],
});

export default function Header() {
  const { currentUser, logout } = useAuth();
  const user = useRecoilValue(userState);
  const router = useRouter();
  const [logged, setLogged] = useState(false);

  const fetchData = useCallback(async () => {
    const login = await currentUser();
    setLogged(login);
    if (login) {
      router.push("/record");
    } else {
      router.push("/");
    }
  }, [currentUser, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = async () => {
    const res = await logout();
    if (res) {
      router.push("/");
    }
  };

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
          {user.id && (
            <>
              <li>
                <Link
                  href="/record"
                  className="p-4 flex justify-center items-center hover:bg-white hover:text-black transition-all"
                >
                  {user.name}
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="p-4 flex justify-center items-center hover:bg-white hover:text-black transition-all"
                >
                  ログアウト
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}
