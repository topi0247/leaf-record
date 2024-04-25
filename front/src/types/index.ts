export interface IUser {
  id: number | null;
  name: string | null;
}

export interface IFile {
  name: string;
  path?: string;
  content?: string;
}

export interface Record {
  name: string;
  description: string;
  private: boolean;
  created_at: string;
}
