"use client";

import Editor from "@/components/editors";
import { useEffect, useRef, useState } from "react";

export default function RecordPage({
  params: { name },
}: {
  params: { name: string };
}) {
  const [text, setText] = useState("");

  return (
    <article className="container m-auto my-8 min-h-screen h-full">
      <h2 className="text-center text-3xl">
        <span className="border-b-2 border-white pb-2 px-4">{name}</span>
      </h2>
      <div className="w-full flex gap-2">
        <section className="my-8 rounded p-2 w-1/2 h-full">
          <form className="bg-slate-700 w-full h-full rounded">
            <Editor text={text} setText={setText} />
          </form>
        </section>
        <section></section>
      </div>
    </article>
  );
}
