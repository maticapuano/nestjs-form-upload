import { applyDecorators, SetMetadata, UseInterceptors } from "@nestjs/common";
import { FormDataInterceptor } from "../interceptors/form-data.interceptor";

export const FILE_UPLOAD_OPTIONS = Symbol("FILE_UPLOAD_OPTIONS");

export interface FileUploadOptionDecorator {
  folder?: string;
  limits?: {
    maxFiles?: number;
    maxFileSize?: number;
  };
}

export const FileUpload = (options?: FileUploadOptionDecorator): MethodDecorator => {
  return applyDecorators(
    SetMetadata(FILE_UPLOAD_OPTIONS, options),
    UseInterceptors(FormDataInterceptor),
  );
};
