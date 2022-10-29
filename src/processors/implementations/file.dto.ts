import { Expose, Type } from "class-transformer";

export abstract class FileDto {
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
  @Type(() => Number)
  public size: number;
}
