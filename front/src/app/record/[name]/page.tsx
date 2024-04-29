"use client";

import { authClient } from "@/api";
import { Editor, FixedButtonPC, FixedButtonSP } from "@/components/records";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FaFile } from "react-icons/fa";
import { IFile } from "@/types";
import { recordsState } from "@/recoil";
import { useRecoilState } from "recoil";

export default function RecordPage({
  params: { name },
}: {
  params: { name: string };
}) {
  const [fileName, setFileName] = useState("");
  const [currentFile, setCurrentFile] = useState<IFile>({
    id: 0,
    name: "",
    path: "",
    content: "",
    is_delete: false,
    old_path: "",
  });
  const [allFile, setAllFile] = useState<IFile[]>([]);
  const router = useRouter();
  const [records, setRecords] = useRecoilState(recordsState);
  const [isLoading, setIsLoading] = useState(true);
  const [isCommit, setIsCommit] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
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
        const currentRecord = records.filter((record) => record.name !== name);
        setRecords(currentRecord);
        router.push("/record");
        return;
      }

      let files = res.data.files || [];
      if (files.length === 0) {
        return;
      }

      files = files.map((file: IFile, index: number) => {
        return {
          ...file,
          id: index,
          is_delete: false,
          old_path: file.path,
        };
      });

      setAllFile(files);
      setCurrentFile(files[0]);
    } catch (e) {
      alert("エラーが発生しました");
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateFile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!/^[a-zA-Z0-9_.-]+$/.test(fileName)) {
      alert("ファイル名に使用できない文字が含まれています");
      return;
    }

    const fileExtension = fileName.includes(".")
      ? fileName.split(".").pop()
      : "";
    const newFileName = fileName.includes(".")
      ? fileName.split(".").shift() + "."
      : fileName;
    const newFilePath = `${newFileName}${
      fileExtension === "" ? ".md" : fileExtension
    }`;

    if (
      allFile
        ?.filter((file) => !file.is_delete)
        .some((file) => file.path === newFilePath)
    ) {
      alert("ファイル名が重複しています");
      return;
    }

    const newFile = {
      id: allFile[allFile.length - 1]?.id + 1 || 0,
      name: newFilePath,
      path: newFilePath,
      content: "",
      is_delete: false,
      old_path: "",
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

  const handleSelectFile = (id: string) => {
    const selectedFile = allFile.find((file) => file.id === Number(id));
    if (!selectedFile || selectedFile.id === currentFile.id) {
      return;
    }

    const updateAllFile = allFile
      .map((file) => {
        if (file.id === currentFile.id) {
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

    if (
      allFile
        ?.filter((file) => !file.is_delete)
        .some((file) => file.name === newFileName)
    ) {
      alert("ファイル名が重複しています");
      return;
    }

    const updateAllFile = allFile
      .map((file) => {
        if (file.name === currentFile.name) {
          return { ...file, name: newFileName, path: newFileName };
        }
        return file;
      })
      .filter((file): file is IFile => file !== null);
    setAllFile(updateAllFile);
    setCurrentFile({ ...currentFile, name: newFileName, path: newFileName });
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
    const updateFile = allFile.map((file) => {
      if (file.id === currentFile.id) {
        return { ...file, is_delete: true };
      }
      return file;
    });
    setAllFile(updateFile);
    setCurrentFile({
      id: 0,
      name: "",
      path: "",
      content: "",
      is_delete: true,
      old_path: "",
    });
  };

  const handleSave = async () => {
    setIsCommit(true);
    try {
      const updateAllFile = allFile.map((file) => {
        if (file.id === currentFile?.id) {
          return {
            name: currentFile.name,
            path: currentFile.path,
            content: currentFile.content,
            is_delete: currentFile.is_delete,
            old_path: currentFile.old_path,
          };
        }
        return {
          name: file.name,
          path: file.path,
          content: file.content,
          is_delete: file.is_delete,
          old_path: file.old_path,
        };
      });

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
        const message = Array.isArray(res.data.message)
          ? res.data.message.join("\n")
          : res.data.message;
        alert(message);
        return;
      }

      alert("コミットしました");
    } catch (e) {
      alert("エラーが発生しました");
    } finally {
      setIsCommit(false);
    }
  };

  const handleCreateFileSP = () => {
    const newFileName = prompt(
      "新しいファイル名を入力してください\n※拡張子もつけてください"
    );
    if (!newFileName) {
      return;
    }

    if (allFile?.some((file) => file.name === newFileName)) {
      alert("ファイル名が重複しています");
      return;
    }

    const newFile = {
      id: allFile[allFile.length - 1]?.id + 1 || 0,
      name: newFileName,
      path: newFileName,
      content: "",
      is_delete: false,
      old_path: "",
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
          {isLoading ? (
            <section className="hidden md:block w-1/5 border-2 border-blue-300 border-opacity-40 rounded my-8 top-5 h-[140px] animate-pulse">
              <div className="h-full bg-blue-200 opacity-50 flex justify-center items-center">
                <p className="text-black text-center">読込中</p>
              </div>
            </section>
          ) : (
            <section className="hidden md:block w-1/5 bg-blue-200 bg-opacity-20 border-2 border-blue-300 border-opacity-40 rounded p-4 my-8 sticky top-5 h-full">
              <h3 className="text-start mb-2">記録</h3>
              <div className="ml-3 overflow-hidden">
                <form className="w-full mb-4" onSubmit={handleCreateFile}>
                  <input
                    type="text"
                    className="rounded w-full text-black p-1 px-2 focus:outline-none"
                    onChange={(e) => setFileName(e.target.value)}
                    value={fileName}
                    placeholder="README"
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
                      {allFile
                        ?.filter((file) => !file.is_delete)
                        .map((file, index) => (
                          <li key={index}>
                            <button
                              className={`w-full flex items-center hover:bg-slate-400 hover:text-slate-900 transition-all rounded p-1 text-left px-2 ${
                                currentFile?.name === file.name &&
                                `bg-slate-400 text-slate-900`
                              }`}
                              type="button"
                              onClick={() => handleSelectFile(String(file.id))}
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
          )}

          <section className="md:my-8 rounded p-2 w-full md:w-4/5 h-full">
            <div className="bg-slate-700 w-full h-full rounded">
              <Editor
                currentFile={currentFile}
                setCurrentFile={setCurrentFile}
                isLoading={isLoading}
              />
            </div>
          </section>
        </div>
      </article>

      <FixedButtonPC
        handleChangeFileName={handleChangeFileName}
        handleDeleteFile={handleDeleteFile}
        handleSave={handleSave}
        isCommit={isCommit}
      />
      <FixedButtonSP
        handleSelectFile={handleSelectFile}
        handleDeleteFile={handleDeleteFile}
        handleCreateFileSP={handleCreateFileSP}
        handleChangeFileName={handleChangeFileName}
        handleSave={handleSave}
        currentFile={currentFile}
        allFile={allFile}
        isCommit={isCommit}
      />
    </>
  );
}
