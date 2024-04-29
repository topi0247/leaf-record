import Link from "next/link";

export default function Footer() {
  return (
    <div className="mt-8 mb-2">
      <ul className="flex flex-col md:flex-row items-start ml-2 md:m-auto justify-center md:items-center text-xs gap-2">
        <li>©2024 Leaf Record</li>
        <li>
          <Link href="/privacypolicy">プライバシーポリシー</Link>
        </li>
        <li>
          <Link href="/termsofservice">利用規約</Link>
        </li>
        <li>
          <Link href="/contact">お問い合わせ</Link>
        </li>
      </ul>
    </div>
  );
}
