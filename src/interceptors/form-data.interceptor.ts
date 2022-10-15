import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { catchError, from, mergeMap, Observable } from "rxjs";
import { InjectConfig } from "../constants/inject-config.constant";
import { FILE_UPLOAD_OPTIONS } from "../decorators/file-upload.decorator";
import { FileUploadOptions } from "../interfaces/file-upload-options.interface";
import { FormProcessor } from "../utils/form-processor";

@Injectable()
export class FormDataInterceptor implements NestInterceptor {
  public constructor(
    @Inject(InjectConfig) private globalConfig: FileUploadOptions,
    private reflect: Reflector,
  ) {}

  public async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    if (!this.isFormData(request.headers)) {
      const message = "Sorry, only multipart/form-data is supported";

      throw new BadRequestException(message);
    }

    const config = {
      ...(this.reflect.get(FILE_UPLOAD_OPTIONS, context.getHandler()) || {}),
      ...this.globalConfig,
    };

    const formProcessor = new FormProcessor(request, config);

    return from(formProcessor.handle()).pipe(
      mergeMap(result => {
        request.body = result;

        return next.handle();
      }),
      catchError(error => {
        throw error;
      }),
    );
  }

  private isFormData(headers: Record<string, string>): boolean {
    const contentType = headers["content-type"] || "";

    return contentType.includes("multipart/form-data");
  }
}
