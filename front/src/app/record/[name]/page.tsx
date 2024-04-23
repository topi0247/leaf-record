"use client";

import { authClient } from "@/api";
import Editor from "@/components/records";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaFile } from "react-icons/fa";

interface IFile {
  name: string;
  path?: string;
  content?: string;
}

export default function RecordPage({
  params: { name },
}: {
  params: { name: string };
}) {
  const [fileName, setFileName] = useState("");
  const [currentContent, setCurrentContent] = useState("");
  const [currentFile, setCurrentFile] = useState<IFile | null>(null);
  const [allFile, setAllFile] = useState<IFile[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const res = await authClient.get(`/records/${name}`);
      if (res.status === 500) {
        alert("エラーが発生しました");
        return;
      } else if (res.status === 401) {
        alert("ログインしてください");
        router.push("/");
        return;
      }

      if (res.data.success === false) {
        alert(res.data.message);
        return;
      }

      setAllFile(res.data.data || []);
      if (res.data.length > 0) {
        setCurrentFile(res.data[0]);
        setCurrentContent(res.data[0].content || "");
      } else {
      }
    };
    fetchData();
  }, []);

  const handleCreateFile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (allFile?.some((file) => file.name === fileName)) {
      alert("ファイル名が重複しています");
      return;
    }

    const newFile = {
      name: fileName,
    };

    setAllFile([...allFile, newFile]);
    setCurrentFile(newFile);
    setFileName("");
  };

  const handleSelectFile = (name: string) => {
    const selectedFile = allFile.find((file) => file.name === name);
    if (!selectedFile || selectedFile === currentFile) {
      return;
    }

    const updateContent = currentContent;
    const updateFile = {
      ...currentFile,
      content: updateContent,
    };

    const updateAllFile = allFile
      .map((file) => {
        if (file.name === updateFile.name) {
          return updateFile;
        }
        return file;
      })
      .filter((file): file is IFile => file !== null);

    setAllFile(updateAllFile);
    setCurrentFile(selectedFile);
    setCurrentContent(selectedFile.content || "");
  };

  const handleChangeFileName = () => {
    if (!currentFile?.name) {
      alert("ファイルを選択してください");
      return;
    }
    const newFileName = prompt("新しいファイル名を入力してください");
    if (!newFileName) {
      return;
    }
    currentFile.name = newFileName;
    const updateAllFile = allFile
      .map((file) => {
        if (file.name === currentFile.name) {
          return currentFile;
        }
        return file;
      })
      .filter((file): file is IFile => file !== null);
    setAllFile(updateAllFile);
  };

  const handleDeleteFile = () => {
    if (!currentFile?.name) {
      alert("ファイルを選択してください");
      return;
    }
    const isDelete = confirm("ファイルを削除しますか？");
    if (!isDelete) {
      return;
    }
    const updateAllFile = allFile.filter(
      (file) => file.name !== currentFile.name
    );
    setAllFile(updateAllFile);
    setCurrentFile(null);
    setCurrentContent("");
  };

  return (
    <>
      <article className="container m-auto my-8 min-h-screen h-full">
        <div className="flex text-center">
          <h4 className="w-1/5  text-xl">
            <span className="w-full border-b-2 border-white pb-2 px-4">
              {name}
            </span>
          </h4>
          <div className="mb-4 w-4/5 flex items-center">
            {currentFile?.name && (
              <h3 className="text-center text-3xl w-full">
                {currentFile?.name}
              </h3>
            )}
          </div>
        </div>
        <div className="w-full flex gap-2">
          <section className="w-1/5 bg-blue-200 bg-opacity-20 border-2 border-blue-300 border-opacity-40 rounded p-4 my-8 sticky top-5 h-full">
            <h3 className="text-start mb-4">記録</h3>
            <div className="ml-3 overflow-hidden">
              <form className="w-full mb-4" onSubmit={handleCreateFile}>
                <input
                  type="text"
                  className="rounded w-full text-black p-1 px-2 focus:outline-none"
                  onChange={(e) => setFileName(e.target.value)}
                  value={fileName}
                />
                <button className="text-sm text-center block m-auto w-full tracking-widest my-1 bg-slate-500 py-1 rounded hover:bg-slate-950 transition-all hover:text-white">
                  新規ファイル作成
                </button>
                <span className="text-xs">※拡張子もつけてください</span>
              </form>
              {allFile.length > 0 && (
                <>
                  <hr className="my-2 border-slate-500" />
                  <ul>
                    {allFile?.map((file, index) => (
                      <li
                        className="flex justify-start items-start"
                        key={index}
                      >
                        <div className="flex justify-center items-start w-1/6 mt-1">
                          <FaFile className="opacity-50 text-sm" />
                        </div>
                        <button
                          className="w-4/5 hover:bg-slate-400 hover:text-slate-900 transition-all rounded p-1 text-left px-2"
                          type="button"
                          onClick={() => handleSelectFile(file.name)}
                        >
                          <span className="line-clamp-1 hover:line-clamp-none break-words text-start transition">
                            {file.name}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </section>
          {currentFile?.name && (
            <>
              <section className="my-8 rounded p-2 w-4/5 h-full">
                <form className="bg-slate-700 w-full h-full rounded">
                  <Editor
                    content={currentContent}
                    setCurrentContent={setCurrentContent}
                  />
                </form>
              </section>
              <section></section>
            </>
          )}
        </div>
      </article>
      <article className="fixed bottom-3 right-0 w-full">
        <section className="text-black m-auto w-full max-w-lg">
          <ul className="flex justify-center items-center bg-slate-300 w-full px-4 py-2 rounded">
            <li>
              <button
                className="px-4 py-2 hover:bg-slate-800 transition-all hover:text-white rounded"
                onClick={handleChangeFileName}
              >
                ファイル名変更
              </button>
            </li>
            <li>
              <button
                className="px-4 py-2 hover:bg-slate-800 transition-all hover:text-white rounded"
                onClick={handleDeleteFile}
              >
                ファイル削除
              </button>
            </li>
            <li>
              <button className="px-4 py-2 hover:bg-slate-800 transition-all hover:text-white rounded">
                プレビュー
              </button>
            </li>
            <li>
              <button className="px-4 py-2 hover:bg-slate-800 transition-all hover:text-white rounded">
                全体保存
              </button>
            </li>
          </ul>
        </section>
      </article>
    </>
  );
}
