import { Type } from "@nestjs/common";
import { FileProcessor } from "../../file-processor";
import { MemoryFile } from "./dtos/memory-file-response.dto";

export class MemoryDiskProcessor extends FileProcessor<MemoryFile> {
  public dtoResponse: Type<MemoryFile> = MemoryFile;

  public async process(): Promise<MemoryFile> {
    return {
      ...this.getMetadata(),
      buffer: this.getBuffer(),
    };
  }
}
