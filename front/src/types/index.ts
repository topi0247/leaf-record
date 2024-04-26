export interface IUser {
  id: number | null;
  name: string | null;
}

export interface IFile {
  name: string;
  path?: string;
  content?: string;
  is_delete: boolean;
}

export interface IRecord {
  name: string;
  description: string;
  private: boolean;
  created_at: string;
}
