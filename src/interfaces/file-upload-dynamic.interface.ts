import { Type } from "@nestjs/common";
import { FileUploadOptions } from "./file-upload-options.interface";

export interface FileUploadDynamicOptions {
  imports?: Type[];
  useFactory?: (...args: any[]) => Promise<FileUploadOptions> | FileUploadOptions;
  inject?: any[];
}
