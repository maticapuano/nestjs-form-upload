import { FileUploadProvider } from "../enums/file-upload-provider.enum";
import { NamingStrategy } from "../types/naming-strategy.type";
import { ResizeOptions } from "./resize.options.interface";

export type FileUploadOptions = MemoryDiskOptions;

export interface FileUploadOptionsBase {
  folder?: string;
  namingStrategy?: NamingStrategy;
  options?: {
    [key: string]: any;
    /**
     * Limit type of extensions allowed to upload (e.g. ['jpg', 'png'])
     * @default []
     */
    extensions?: string[];
    /**
     * Limit the maximum size of the file in bytes.
     * If the file is larger than this value, an error will be thrown.
     * @default Infinity
     */
    maxFileSize?: number;
    /**
     * Limit the number of files that can be uploaded at once.
     * If the number of files exceeds this value, an error will be thrown.
     * @default Infinity
     */
    maxFiles?: number;
    /**
     * Resize the image to the specified dimensions.
     */
    resize?: Record<string, ResizeOptions>;
  };
}

export interface MemoryDiskOptions extends FileUploadOptionsBase {
  provider: FileUploadProvider.MEMORY;
  options?: FileUploadOptionsBase["options"] & {};
}
