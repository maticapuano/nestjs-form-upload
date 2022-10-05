import { FileUploadProvider } from "../enums/file-upload-provider.enum";
import { FileUploadOptions } from "../interfaces/file-upload-options.interface";

export const globalConfig: FileUploadOptions = {
  provider: FileUploadProvider.DISK,
  options: {
    baseUrl: "http://localhost:3000",
    uploadPath: "/",
  },
};
