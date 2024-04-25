import Link from "next/link";

export default function Footer() {
  return (
    <div>
      <ul className="flex justify-center items-center text-xs gap-2">
        <li>©2024 Leaf Record</li>
        <li>
          <Link href="/privacypolicy">プライバシーポリシー</Link>
        </li>
        <li><Link href="/">利用規約</Link></li>
      </ul>
    </div>
  );
}
