import { Expose, Type } from "class-transformer";

export class S3File {
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
  @Type(() => String)
  public url: string;
}
