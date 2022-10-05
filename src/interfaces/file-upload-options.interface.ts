import { FileUploadProvider } from "../enums/file-upload-provider.enum";

export type FileUploadOptions = FileDiskOptions;

export interface FileDiskOptions {
  provider: FileUploadProvider.DISK;
  options: {
    baseUrl: string;
    uploadPath: string;
  };
}
