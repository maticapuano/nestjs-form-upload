import { Expose, Type } from "class-transformer";
import { FileDto } from "../../file.dto";

export class MemoryFile extends FileDto {
  @Expose()
  @Type(() => Buffer)
  public buffer: Buffer;

  @Expose()
  public resized: Buffer | null;
}
