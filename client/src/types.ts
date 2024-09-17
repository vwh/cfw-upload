export type FileData = {
  name: string;
  size: number;
  type: string;
  id: string;
  created_at: number;
  expires_at: number;
};

export type UploadResponse = {
  fileId: string;
  message: string;
};

export type UploadedFile = {
  file: File;
  preview: string;
  response?: UploadResponse;
  isUploading: boolean;
};
