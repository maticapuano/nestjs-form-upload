import { FileUploadProvider } from "../enums/file-upload-provider.enum";
import { FileUploadOptions } from "../interfaces/file-upload-options.interface";

export const globalConfig: FileUploadOptions = {
  provider: FileUploadProvider.MEMORY,
  options: {},
};
