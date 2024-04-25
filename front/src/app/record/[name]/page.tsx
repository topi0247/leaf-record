"use client";

import { authClient } from "@/api";
import { Editor } from "@/components/records";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FaFile } from "react-icons/fa";
import { IFile } from "@/types";
import * as Shadcn from "@/components/shadcn";

export default function RecordPage({
  params: { name },
}: {
  params: { name: string };
}) {
  const [fileName, setFileName] = useState("");
  const [currentFile, setCurrentFile] = useState<IFile>({
    name: "",
    path: "",
    content: "",
  });
  const [allFile, setAllFile] = useState<IFile[]>([]);
  const router = useRouter();

  const fetchData = useCallback(async () => {
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
      router.push("/record");
      return;
    }

    setAllFile(res.data.files || []);
    setCurrentFile(res.data.files[0] || {});
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateFile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (allFile?.some((file) => file.name === fileName)) {
      alert("ファイル名が重複しています");
      return;
    }

    const newFile = {
      name: fileName,
      path: fileName,
      content: "",
    };

    const selectFile = allFile.find((file) => file.name === currentFile?.name);
    let updateAllFile = allFile.map((file) => {
      if (file.name === selectFile?.name) {
        return currentFile;
      }
      return file;
    });
    updateAllFile.push(newFile);

    setAllFile(updateAllFile);
    setCurrentFile(newFile);
    setFileName("");
  };

  const handleSelectFile = (name: string) => {
    console.log(name);
    const selectedFile = allFile.find((file) => file.name === name);
    if (!selectedFile || selectedFile === currentFile) {
      return;
    }

    const updateAllFile = allFile
      .map((file) => {
        if (file.name === currentFile?.name) {
          return currentFile;
        }
        return file;
      })
      .filter((file): file is IFile => file !== null);

    setAllFile(updateAllFile);
    setCurrentFile(selectedFile);
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
    const updateAllFile = allFile
      .map((file) => {
        if (file.name === newFileName) {
          return { ...file, name: newFileName };
        }
        return file;
      })
      .filter((file): file is IFile => file !== null);
    setAllFile(updateAllFile);
    setCurrentFile({ ...currentFile, name: newFileName });
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
    setCurrentFile({ name: "", path: "", content: "" });
  };

  const handleSave = async () => {
    const updateAllFile = allFile
      .map((file) => {
        if (file.name === currentFile?.name) {
          return currentFile;
        }
        return file;
      })
      .filter((file): file is IFile => file !== null);
    setAllFile(updateAllFile);

    const res = await authClient.patch(`/records/${name}`, {
      files: updateAllFile,
    });
    if (res.status === 500) {
      alert("エラーが発生しました");
      return;
    } else if (res.status === 401) {
      alert("ログインしてください");
      router.push("/");
      return;
    }

    if (res.data.success === false) {
      const message = res.data.message.join("\n");
      alert(message);
      return;
    }

    alert("保存しました");
  };

  return (
    <>
      <article className="md:container m-auto my-8 min-h-screen h-full">
        <div className="container md:contain-none flex flex-col text-center gap-4">
          <h4 className="text-xl">
            <span className="w-full border-b-2 border-white pb-1 px-4">
              {name}
            </span>
          </h4>
          <div className="flex items-center">
            {currentFile?.name && (
              <h3 className="text-center text-3xl w-full">
                {currentFile?.name}
              </h3>
            )}
          </div>
        </div>
        <div className="w-full flex gap-2">
          <section className="hidden md:block w-1/5 bg-blue-200 bg-opacity-20 border-2 border-blue-300 border-opacity-40 rounded p-4 my-8 sticky top-5 h-full">
            <h3 className="text-start mb-2">記録</h3>
            <div className="ml-3 overflow-hidden">
              <form className="w-full mb-4" onSubmit={handleCreateFile}>
                <span className="text-xs">※拡張子もつけてください</span>
                <input
                  type="text"
                  className="rounded w-full text-black p-1 px-2 focus:outline-none"
                  onChange={(e) => setFileName(e.target.value)}
                  value={fileName}
                  placeholder="README.md"
                />
                <button
                  className={`text-sm text-center block m-auto w-full tracking-widest my-1 py-1 rounded hover:bg-slate-950 transition-all hover:text-white ${
                    fileName.length === 0
                      ? "bg-slate-950 cursor-not-allowed"
                      : "bg-slate-500"
                  }`}
                  disabled={fileName.length === 0}
                >
                  新規ファイル作成
                </button>
              </form>
              {allFile.length > 0 && (
                <>
                  <hr className="my-2 border-slate-500" />
                  <ul className="flex flex-col gap-1">
                    {allFile?.map((file, index) => (
                      <li key={index}>
                        <button
                          className={`w-full flex items-center hover:bg-slate-400 hover:text-slate-900 transition-all rounded p-1 text-left px-2 ${
                            currentFile?.name === file.name &&
                            `bg-slate-400 text-slate-900`
                          }`}
                          type="button"
                          onClick={() => handleSelectFile(file.name)}
                        >
                          <span className="w-25 h-25 mr-1">
                            <FaFile className="opacity-50 text-sm" />
                          </span>
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
              <section className="md:my-8 rounded p-2 w-full md:w-4/5 h-full">
                <div className="bg-slate-700 w-full h-full rounded">
                  <Editor
                    currentFile={currentFile}
                    setCurrentFile={setCurrentFile}
                  />
                </div>
              </section>
            </>
          )}
        </div>
      </article>
      <article className="fixed w-full bottom-10 right-0 md:w-4/5 md:bottom-12">
        <section className="hidden text-black md:flex justify-center items-end">
          <Shadcn.Menubar className="flex items-center py-8">
            <Shadcn.MenubarMenu>
              <Shadcn.MenubarTrigger
                className="cursor-pointer hover:bg-slate-700 hover:text-white transition-all"
                onClick={handleChangeFileName}
              >
                ファイル名変更
              </Shadcn.MenubarTrigger>
            </Shadcn.MenubarMenu>
            <Shadcn.MenubarMenu>
              <Shadcn.MenubarTrigger
                className="cursor-pointer hover:bg-slate-700 hover:text-white transition-all"
                onClick={handleDeleteFile}
              >
                ファイル削除
              </Shadcn.MenubarTrigger>
            </Shadcn.MenubarMenu>
            <Shadcn.MenubarMenu>
              <Shadcn.MenubarTrigger
                className="cursor-pointer hover:bg-slate-700 hover:text-white transition-all"
                onClick={handleSave}
              >
                コミット
              </Shadcn.MenubarTrigger>
            </Shadcn.MenubarMenu>
          </Shadcn.Menubar>
        </section>
      </article>
      <article className="fixed bottom-8 left-0 w-full flex justify-center items-center gap-2 md:hidden">
        <Shadcn.Drawer>
          <Shadcn.DrawerTrigger className="border border-slate-200 px-2 py-1 rounded">
            ファイル操作
          </Shadcn.DrawerTrigger>
          <Shadcn.DrawerContent>
            <div className="flex justify-end items-center mr-2 my-3 gap-3">
              <button
                className="bg-red-400 text-white px-2 p-1 rounded"
                onClick={handleDeleteFile}
              >
                削除
              </button>
              <button
                className="rounded border border-slate-300 px-2 py-1"
                onClick={handleChangeFileName}
              >
                ファイル名変更
              </button>
            </div>
            <Shadcn.Select
              defaultValue={currentFile.name}
              onValueChange={handleSelectFile}
            >
              <Shadcn.SelectTrigger>
                <Shadcn.SelectValue
                  placeholder={currentFile.name || "ファイル名"}
                />
              </Shadcn.SelectTrigger>
              <Shadcn.SelectContent>
                {allFile.map((file, index) => (
                  <Shadcn.SelectItem key={index} value={file.name}>
                    {file.name}
                  </Shadcn.SelectItem>
                ))}
              </Shadcn.SelectContent>
            </Shadcn.Select>
            <Shadcn.DrawerFooter>
              <Shadcn.DrawerClose>戻る</Shadcn.DrawerClose>
            </Shadcn.DrawerFooter>
          </Shadcn.DrawerContent>
        </Shadcn.Drawer>
        <button
          onClick={handleSave}
          className="px-2 py-1 border border-white rounded"
        >
          コミット
        </button>
      </article>
    </>
  );
}
