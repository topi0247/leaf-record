"use client";
import { useAuth } from "@/api";
import { userState } from "@/recoil";
import { Rampart_One } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRecoilValue } from "recoil";
import * as Shadcn from "@/components/shadcn";

const RampartOneFont = Rampart_One({
  weight: "400",
  subsets: ["latin"],
});

export default function Header() {
  const { login, logout } = useAuth();
  const user = useRecoilValue(userState);
  const router = useRouter();

  const handleLogout = async () => {
    const res = await logout();
    if (res) {
      router.push("/");
    }
  };

  return (
    <>
      <div className="container flex justify-between items-center m-auto p-2 px-4">
        <h1
          className={`text-xl md:text-3xl md:flex md:justify-center ${RampartOneFont.className}`}
        >
          <Link
            href="/"
            className="flex flex-col md:flex-row justify-center items-center md:gap-2"
          >
            Leaf Record
            <span className="text-sm md:text-xl"> ～大草原不可避～</span>
          </Link>
        </h1>
        <nav className="hidden md:block">
          <ul
            className={`grid ${
              user.id ? "grid-cols-2" : "grid-cols-1"
            } justify-center items-center text-center`}
          >
            {user.id ? (
              <>
                <li>
                  <Link
                    href="/record"
                    className="p-4 flex justify-center items-center hover:bg-white hover:text-black transition-all rounded"
                  >
                    {user.name}
                  </Link>
                </li>

                <li>
                  <button
                    onClick={handleLogout}
                    className="p-4 flex justify-center items-center hover:bg-white hover:text-black transition-all rounded"
                  >
                    ログアウト
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={login}
                  className="p-4 flex justify-center items-center hover:bg-white hover:text-black transition-all rounded"
                >
                  ログイン
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
      <Shadcn.Menubar className="fixed bottom-2 right-2 bg-transparent z-10 md:hidden">
        <Shadcn.MenubarMenu>
          <Shadcn.MenubarTrigger>Menu</Shadcn.MenubarTrigger>
          <Shadcn.MenubarContent className="bg-slate-300 border-slate-300 mr-2">
            {user.id ? (
              <>
                <Shadcn.MenubarItem>
                  <Link href="/record" className="w-full h-full text-end px-2">
                    {user.name}
                  </Link>
                </Shadcn.MenubarItem>
                <Shadcn.MenubarSeparator className="bg-slate-400" />
                <Shadcn.MenubarItem>
                  <button
                    onClick={handleLogout}
                    className="w-full h-full text-end px-2"
                  >
                    ログアウト
                  </button>
                </Shadcn.MenubarItem>
              </>
            ) : (
              <Shadcn.MenubarItem>
                <button onClick={login} className="w-full h-full">
                  ログイン
                </button>
              </Shadcn.MenubarItem>
            )}
          </Shadcn.MenubarContent>
        </Shadcn.MenubarMenu>
      </Shadcn.Menubar>
    </>
  );
}
