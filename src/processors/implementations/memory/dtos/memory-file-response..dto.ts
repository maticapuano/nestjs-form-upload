import { Expose, Type } from "class-transformer";

export class MemoryFile {
  @Expose()
  @Type(() => String)
  public originalName: string;

  @Expose()
  @Type(() => String)
  public encoding: string;

  @Expose()
  @Type(() => String)
  public mimeType: string;

  @Expose()
  @Type(() => String)
  public extension: string;

  @Expose()
  @Type(() => Buffer)
  public buffer: Buffer;
}
