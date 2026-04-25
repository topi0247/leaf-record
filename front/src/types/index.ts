export interface IUser {
  id: number | null;
  name: string | null;
}

export interface IFile {
  id: number;
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

export interface RecordFilesResponse {
  success: boolean;
  message: string;
  files: IFile[];
}

export interface RecordMutationResponse {
  success: boolean;
  message: string | string[];
}

export interface CreateRecordResponse {
  success: boolean;
  message: string;
}
