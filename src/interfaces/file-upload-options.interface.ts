import { FileUploadProvider } from "../enums/file-upload-provider.enum";
import { AwsAcl } from "../processors/implementations/s3/types/aws-acl.type";
import { AwsRegion } from "../processors/implementations/s3/types/aws-region.type";
import { NamingStrategy } from "../types/naming-strategy.type";
import { ResizeOptions } from "./resize.options.interface";

export type FileUploadOptions = MemoryDiskOptions | S3DiskOptions;

export interface FileUploadOptionsBase {
  folder?: string;
  namingStrategy?: NamingStrategy;
  options?: {
    [key: string]: any;
    /**
     * Limit type of extensions allowed to upload (e.g. ['jpg', 'png'])
     * @default []
     */
    extensions?: string[];
    /**
     * Limit the maximum size of the file in bytes.
     * If the file is larger than this value, an error will be thrown.
     * @default Infinity
     */
    maxFileSize?: number;
    /**
     * Limit the number of files that can be uploaded at once.
     * If the number of files exceeds this value, an error will be thrown.
     * @default Infinity
     */
    maxFiles?: number;
    /**
     * Resize the image to the specified dimensions.
     */
    resize?: Record<string, ResizeOptions>;
  };
}

export interface MemoryDiskOptions extends FileUploadOptionsBase {
  provider: FileUploadProvider.MEMORY;
  options?: FileUploadOptionsBase["options"] & {};
}

export interface S3DiskOptions extends FileUploadOptionsBase {
  provider: FileUploadProvider.S3;
  options?: FileUploadOptionsBase["options"] & {
    /**
     * AWS Access Key ID
     */
    accessKeyId: string;
    /**
     * AWS Secret Access Key
     */
    secretAccessKey: string;
    region: AwsRegion;
    /**
     * The AWS region where the bucket is located.
     */
    bucket: string;
    /**
     * The ACL to apply to the uploaded file.
     * @default 'public-read'
     * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html#canned-acl
     */
    acl?: AwsAcl;
  };
}
