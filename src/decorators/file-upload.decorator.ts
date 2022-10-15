import { applyDecorators, SetMetadata, UseInterceptors } from "@nestjs/common";
import { FormDataInterceptor } from "../interceptors/form-data.interceptor";
import { FileUploadOptionsBase } from "../interfaces/file-upload-options.interface";

export const FILE_UPLOAD_OPTIONS = Symbol("FILE_UPLOAD_OPTIONS");

export interface FileUploadOptionDecorator extends FileUploadOptionsBase {
  folder?: string;
}

export const FileUpload = (options?: FileUploadOptionDecorator): MethodDecorator => {
  return applyDecorators(
    SetMetadata(FILE_UPLOAD_OPTIONS, options),
    UseInterceptors(FormDataInterceptor),
  );
};
