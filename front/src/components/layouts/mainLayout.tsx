"use client";
import { useRecoilValue } from "recoil";
import * as Layout from ".";
import { userState } from "@/recoil";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = useRecoilValue(userState);
  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-900 text-white">
      {user.id && (
        <header className="bg-gray-600 w-full">
          <Layout.Header />
        </header>
      )}
      <main className="flex-1 relative">{children}</main>
      <footer>
        <Layout.Footer />
      </footer>
    </div>
  );
}
