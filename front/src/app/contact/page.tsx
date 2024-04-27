"use client";

import { useEffect } from "react";

export default function ContactPage() {
  useEffect(() => {
    const ffCompose = document.getElementById("ff-compose");
    if (ffCompose) {
      ffCompose.appendChild(document.createElement("script")).src =
        process.env.NEXT_PUBLIC_GOOGLE_FORM_URL || "";
    }
  }, []);

  return (
    <article className="w-full m-auto">
      <div id="ff-compose"></div>
    </article>
  );
}
