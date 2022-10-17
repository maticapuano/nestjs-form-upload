import {
  FileProcessorMetadata,
  FileProcessorOptions,
} from "../interfaces/file-processor.interface";
import { FileUploadOptionsBase } from "../interfaces/file-upload-options.interface";
import { ImageResizing } from "../utils/image-resizing";
import { isImageMime } from "../utils/is-image.util";

export abstract class FileProcessor<T> {
  public constructor(private options: FileProcessorOptions) {}

  public abstract process(): Promise<T>;

  public static isFile(file: any): boolean {
    return file && file instanceof FileProcessor;
  }

  protected getBuffer(): Buffer {
    if (!this.options.buffer) {
      throw new Error("Buffer is not defined");
    }

    return this.options.buffer;
  }

  protected async getResized(): Promise<Buffer | null> {
    const config = this.getConfig();
    const isImage = isImageMime(this.options.mimeType);

    if (!isImage || (config && !config.resize)) {
      return null;
    }

    if (config && config.resize && config.resize.width && config.resize.height) {
      return ImageResizing.resize(this.getBuffer(), {
        width: config.resize.width,
        height: config.resize.height,
        quality: config.resize.quality ?? 100,
      });
    }

    return null;
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
