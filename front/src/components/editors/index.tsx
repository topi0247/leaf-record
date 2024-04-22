import { useEffect, useRef, useState } from "react";

const Editor = ({
  text,
  setText,
}: {
  text: string;
  setText: (text: string) => void;
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [rows, setRows] = useState(1);

  useEffect(() => {
    const textArea = textAreaRef.current;

    // イベントリスナーとして使用する関数を定義
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        // エンターキーが押された時のスクロール動作
        requestAnimationFrame(() => {
          if (textArea) {
            const { scrollTop, scrollHeight, clientHeight } = textArea;
            if (scrollTop > scrollHeight - 2 * clientHeight) {
              setRows((prevRows) => prevRows + 1);
              textArea.scrollTop = textArea.scrollHeight;
            }
          }
        });
      }
    };

    if (textArea) {
      textArea.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (textArea) {
        textArea.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, []);

  return (
    <textarea
      ref={textAreaRef}
      rows={rows}
      className="w-full bg-transparent p-4 py-8 focus:outline-none resize-none overflow-hidden rounded resize-x-none"
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
  );
};

export default Editor;
