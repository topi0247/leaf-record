export interface IUser {
  id: number | null;
  name: string | null;
}

export interface IFile {
  name: string;
  path?: string;
  old_path: string;
  is_delete: boolean;
  content?: string;
}

export interface IRecord {
  name: string;
  description: string;
  private: boolean;
  created_at: string;
}
