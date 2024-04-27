"use client";

import { useEffect } from "react";

export default function ContactPage() {
  useEffect(() => {
    const ffCompose = document.getElementById("ff-compose");
    if (ffCompose) {
      ffCompose.appendChild(document.createElement("script")).src =
        "https://formfacade.com/include/112460625306800880577/form/1FAIpQLSdjwPf0biu2LvSiRwhwylIK6q6KaSgf9QpPW_LbX8Yf0BRSfQ/classic.js?div=ff-compose";
    }
  }, []);

  return (
    <article className="w-full m-auto">
      <div id="ff-compose"></div>
    </article>
  );
}
