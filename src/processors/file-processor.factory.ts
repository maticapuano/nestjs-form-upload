import { FileProcessor } from "./file-processor";
import { FileUploadProvider } from "../enums/file-upload-provider.enum";
import { MemoryDiskProcessor } from "./implementations/memory/memory-disk-processor";
import { FileUploadOptions } from "../interfaces/file-upload-options.interface";
import { FileProcessorOptions } from "../interfaces/file-processor.interface";
import { S3DiskProcessor } from "./implementations/s3/s3-disk-processor";

export class FileProcessorFactory {
  public static create(
    options: FileProcessorOptions,
    config: FileUploadOptions,
  ): FileProcessor<unknown> {
    const { provider } = config;

    switch (provider) {
      case FileUploadProvider.MEMORY:
        return new MemoryDiskProcessor(options);
      case FileUploadProvider.S3:
        return new S3DiskProcessor(options);
      default:
        throw new Error("Sorry, we don't support this driver yet.");
    }
  }
}
