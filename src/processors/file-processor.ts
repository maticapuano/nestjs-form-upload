import {
  FileProcessorMetadata,
  FileProcessorOptions,
} from "../interfaces/file-processor.interface";
import { FileUploadOptionsBase } from "../interfaces/file-upload-options.interface";
import { ImageResizing } from "../utils/image-resizing";
import { isImageMime } from "../utils/is-image.util";
import { FileDto } from "./implementations/file.dto";

export abstract class FileProcessor<T> {
  public constructor(private options: FileProcessorOptions) {}

  public abstract process(): Promise<T>;

  public static isFile(file: any): boolean {
    return file && file instanceof FileDto;
  }

  protected getBuffer(): Buffer {
    if (!this.options.buffer) {
      throw new Error("Buffer is not defined");
    }

    return this.options.buffer;
  }

  protected getSize(): number {
    return this.getBuffer().length;
  }

  protected async getResized(): Promise<Buffer | null> {
    const config = this.getConfig();
    const isImage = isImageMime(this.options.mimeType);

    if (!isImage || (config && !config.resize)) {
      return null;
    }

    if (config && config.resize && Object.keys(config.resize).length) {
      const resizeKeys = Object.keys(config.resize);

      for (const key of resizeKeys) {
        const resize = config.resize[key];

        if (!resize || key !== this.options.fieldName) {
          continue;
        }

        const { width, height, quality } = resize;

        if (!width || !height) {
          throw new Error(`Resize width and height are required for ${key} resize`);
        }

        return await ImageResizing.resize(this.getBuffer(), {
          width,
          height,
          quality: quality ?? 100,
        });
      }
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

  public getConfig<T extends FileUploadOptionsBase>(): T["options"] & { folder?: string } {
    return this.options.config as unknown as T;
  }
}
