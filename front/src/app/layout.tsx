import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MainLayout } from "@/components/layouts";
import AppProvider from "@/provider";
import { Analytics } from "@vercel/analytics/react";
import GoogleAnalytics from "@/components/analytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Leaf Record",
  description: "GitHub記録アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <GoogleAnalytics />
      </head>
      <body className={inter.className}>
        <AppProvider>
          <MainLayout>{children}</MainLayout>
        </AppProvider>
        <Analytics />
      </body>
    </html>
  );
}
