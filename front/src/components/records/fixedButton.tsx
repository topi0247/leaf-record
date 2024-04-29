"use client";
import * as Shadcn from "@/components/shadcn";
import React, { useState } from "react";

export function FixedButtonPC({
  handleChangeFileName,
  handleDeleteFile,
  handleSave,
  isCommit,
}: {
  handleChangeFileName: () => void;
  handleDeleteFile: () => void;
  handleSave: () => void;
  isCommit: boolean;
}) {
  return (
    <article className="fixed w-full bottom-10 right-0 md:w-4/5 md:bottom-12">
      <section className="hidden text-black md:flex justify-center items-end">
        <div className="border border-slate-200 py-2 rounded text-white">
          <button
            className="px-2 border-r border-white text-red-300"
            onClick={handleDeleteFile}
          >
            ファイル削除
          </button>
          <button
            className="px-2 border-r border-white"
            onClick={handleChangeFileName}
          >
            ファイル名変更
          </button>
          <button
            className={`px-2 ${
              isCommit ? "text-green-300 cursor-not-allowed" : ""
            }`}
            onClick={handleSave}
            disabled={isCommit}
          >
            コミット<span className={isCommit ? "" : "hidden"}>中</span>
          </button>
        </div>
      </section>
    </article>
  );
}

export function FixedButtonSP({
  handleSelectFile,
  handleDeleteFile,
  handleChangeFileName,
  handleCreateFileSP,
  handleSave,
  currentFile,
  allFile,
  isCommit,
}: {
  handleSelectFile: (value: string) => void;
  handleDeleteFile: () => void;
  handleChangeFileName: () => void;
  handleCreateFileSP: () => void;
  handleSave: () => void;
  currentFile: { name: string };
  allFile: { id: number; name: string; is_delete: boolean }[];
  isCommit: boolean;
}) {
  return (
    <article className="fixed bottom-12 right-0 w-full flex justify-end items-center gap-1 md:hidden mx-2">
      <Shadcn.Drawer>
        <Shadcn.DrawerTrigger className="border border-slate-200 px-2 py-1 rounded">
          ファイル操作
        </Shadcn.DrawerTrigger>
        <Shadcn.DrawerContent>
          <Shadcn.Select onValueChange={handleSelectFile}>
            <div className="flex flex-col px-3 w-full justify-center items-center relative">
              <span className="text-end w-full text-xs">ファイル選択</span>
              <Shadcn.SelectTrigger className="w-full">
                <Shadcn.SelectValue
                  placeholder={currentFile.name || "ファイル名"}
                />
              </Shadcn.SelectTrigger>
              <Shadcn.SelectContent className="absolute bottom-0">
                {allFile
                  ?.filter((file) => !file.is_delete)
                  .map((file, index) => (
                    <Shadcn.SelectItem key={index} value={String(file.id)}>
                      {file.name}
                    </Shadcn.SelectItem>
                  ))}
              </Shadcn.SelectContent>
            </div>
          </Shadcn.Select>
          <Shadcn.DrawerFooter>
            <div className="flex justify-end items-center mr-2 my-3 gap-2">
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
              <button
                className="rounded border border-slate-300 px-2 py-1"
                onClick={handleCreateFileSP}
              >
                新規作成
              </button>
            </div>
            <Shadcn.DrawerClose>戻る</Shadcn.DrawerClose>
          </Shadcn.DrawerFooter>
        </Shadcn.DrawerContent>
      </Shadcn.Drawer>
      <button
        onClick={handleSave}
        className={`px-2 py-1 border border-white rounded ${
          isCommit ? "text-green-300 border-green-300" : ""
        }`}
        disabled={isCommit}
      >
        コミット<span className={isCommit ? "" : "hidden"}>中</span>
      </button>
    </article>
  );
}
