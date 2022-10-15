import { Type } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import {
  FileProcessorMetadata,
  FileProcessorOptions,
} from "../interfaces/file-processor.interface";
import { FileUploadOptionsBase } from "../interfaces/file-upload-options.interface";

export abstract class FileProcessor<T> {
  abstract dtoResponse: Type<T>;

  public constructor(private options: FileProcessorOptions) {}

  public abstract process(): Promise<T>;

  public async execute(): Promise<T> {
    return plainToClass(Object.assign(this.constructor, this.dtoResponse), {
      ...this.getMetadata(),
      buffer: this.getBuffer(),
    });
  }

  protected getBuffer(): Buffer {
    if (!this.options.buffer) {
      throw new Error("Buffer is not defined");
    }

    return this.options.buffer;
  }

  protected getMetadata(): FileProcessorMetadata {
    return {
      originalName: this.options.originalName,
      encoding: this.options.encoding,
      extension: this.options.extension,
      mimeType: this.options.mimeType,
    };
  }

  protected getExtension(): string {
    return this.options.extension;
  }

  public getConfig<T extends FileUploadOptionsBase>(): T["options"] {
    return this.options.config as unknown as T;
  }
}
