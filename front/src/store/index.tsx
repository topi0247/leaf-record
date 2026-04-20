"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import type { IUser, IRecord } from "@/types";

const UserContext = createContext<IUser>({ id: null, name: null });
const SetUserContext = createContext<(v: IUser) => void>(() => {});
const RecordsContext = createContext<IRecord[]>([]);
const SetRecordsContext = createContext<(v: IRecord[]) => void>(() => {});

export function useUserState() {
  return useContext(UserContext);
}

export function useSetUserState() {
  return useContext(SetUserContext);
}

export function useRecordsState(): [IRecord[], (v: IRecord[]) => void] {
  return [useContext(RecordsContext), useContext(SetRecordsContext)];
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser>({ id: null, name: null });
  const [records, setRecords] = useState<IRecord[]>([]);

  return (
    <UserContext.Provider value={user}>
      <SetUserContext.Provider value={setUser}>
        <RecordsContext.Provider value={records}>
          <SetRecordsContext.Provider value={setRecords}>
            {children}
          </SetRecordsContext.Provider>
        </RecordsContext.Provider>
      </SetUserContext.Provider>
    </UserContext.Provider>
  );
}
