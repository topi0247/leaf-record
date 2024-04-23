export interface IUser {
  id: number | null;
  name: string | null;
}

export interface IFile {
  name: string;
  path?: string;
  content?: string;
}
