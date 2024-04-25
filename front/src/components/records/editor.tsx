import { useEffect, useRef, useState } from "react";
import { IFile } from "@/types";

const Editor = ({
  currentFile,
  setCurrentFile,
}: {
  currentFile: IFile;
  setCurrentFile: (currentFile: IFile) => void;
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
    const count = newlineCount(currentFile?.content || "");
    setRows(count + INIT_ROWS / 2);
  }, [currentFile?.content]);

  const newlineCount = (text: string) => {
    const regex = /\n/g;
    const matches = text.match(regex);
    return matches ? matches.length : 0;
  };

  const handleUpdateContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentFile({
      ...currentFile,
      content: e.target.value,
    });
  };

  return (
    <textarea
      ref={textAreaRef}
      rows={rows}
      className="w-full bg-transparent p-4 py-8 focus:outline-none resize-none overflow-hidden rounded resize-x-none"
      value={currentFile?.content ? currentFile.content : ""}
      onChange={handleUpdateContent}
    />
  );
};

export default Editor;
