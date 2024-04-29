import { useEffect, useRef, useState } from "react";
import { IFile } from "@/types";

const Editor = ({
  currentFile,
  setCurrentFile,
  isLoading,
}: {
  currentFile: IFile;
  setCurrentFile: (currentFile: IFile) => void;
  isLoading: boolean;
}) => {
  const INIT_ROWS = 50;
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [rows, setRows] = useState(INIT_ROWS);

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
    <>
      {isLoading ? (
        <div className="h-screen animate-pulse">
          <div className="rounded h-full bg-slate-300 opacity-50 flex justify-center items-start">
            <p className="text-slate-800 text-xl mt-24">読込中</p>
          </div>
        </div>
      ) : (
        <textarea
          ref={textAreaRef}
          rows={rows}
          className="w-full bg-transparent p-4 focus:outline-none resize-none overflow-x-hidden rounded resize-x-none"
          value={currentFile?.content ? currentFile.content : ""}
          onChange={handleUpdateContent}
          placeholder="ここに記録を書けるよ！"
        />
      )}
    </>
  );
};

export default Editor;
