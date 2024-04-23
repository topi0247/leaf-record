import { useEffect, useRef, useState } from "react";

const Editor = ({
  content,
  setCurrentContent,
}: {
  content: string;
  setCurrentContent: (content: string) => void;
}) => {
  const INIT_ROWS = 50;
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [rows, setRows] = useState(INIT_ROWS);

  useEffect(() => {
    // const textArea = textAreaRef.current;
    // // イベントリスナーとして使用する関数を定義
    // const handleKeyDown = (event: KeyboardEvent) => {
    //   if (event.key === "Enter") {
    //     // エンターキーが押された時のスクロール動作
    //     requestAnimationFrame(() => {
    //       if (textArea) {
    //         const { scrollTop, scrollHeight, clientHeight } = textArea;
    //         if (scrollTop > scrollHeight - 2 * clientHeight) {
    //           setRows((prevRows) => prevRows + 1);
    //           textArea.scrollTop = textArea.scrollHeight;
    //         }
    //       }
    //     });
    //   }
    // };
    // if (textArea) {
    //   textArea.addEventListener("keydown", handleKeyDown);
    // }
    // return () => {
    //   if (textArea) {
    //     textArea.removeEventListener("keydown", handleKeyDown);
    //   }
    // };
  }, []);

  useEffect(() => {
    handleTextChange(content);
  }, [content]);

  const newlineCount = (text: string) => {
    const regex = /\n/g;
    const matches = text.match(regex);
    return matches ? matches.length : 0;
  };

  const handleTextChange = (text: string) => {
    const count = newlineCount(text);
    setRows(count + INIT_ROWS / 2);
  };

  return (
    <textarea
      ref={textAreaRef}
      rows={rows}
      className="w-full bg-transparent p-4 py-8 focus:outline-none resize-none overflow-hidden rounded resize-x-none"
      value={content}
      onChange={(e) => setCurrentContent(e.target.value)}
    />
  );
};

export default Editor;
