import { plainToClass } from "class-transformer";
import { FileProcessor } from "../../file-processor";
import { MemoryFile } from "./dtos/memory-file-response.dto";

export class MemoryDiskProcessor extends FileProcessor<MemoryFile> {
  public async process(): Promise<MemoryFile> {
    return plainToClass(MemoryFile, {
      ...this.getMetadata(),
      buffer: this.getBuffer(),
      resized: await this.getResized(),
    });
  }
}
