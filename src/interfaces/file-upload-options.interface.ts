import { FileUploadProvider } from "../enums/file-upload-provider.enum";

export type FileUploadOptions = MemoryDiskOptions;

export interface FileUploadOptionsBase {
  options: {
    [key: string]: any;
  };
}

export interface MemoryDiskOptions extends FileUploadOptionsBase {
  provider: FileUploadProvider.MEMORY;
  options: {};
}
