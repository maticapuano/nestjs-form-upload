import { S3DiskOptions } from "../../../interfaces/file-upload-options.interface";
import { FileProcessor } from "../../file-processor";
import { S3 } from "aws-sdk";
import { FileProcessorOptions } from "../../../interfaces/file-processor.interface";
import { PutObjectRequest } from "aws-sdk/clients/s3";
import { plainToClass } from "class-transformer";
import { S3File } from "./dtos/s3-file.dto";

export class S3DiskProcessor extends FileProcessor<any> {
  private s3: S3;

  public constructor(options: FileProcessorOptions) {
    super(options);

    const config = this.getConfig<S3DiskOptions>();

    if (
      !config ||
      !config.accessKeyId ||
      !config.secretAccessKey ||
      !config.region ||
      !config.bucket
    ) {
      throw new Error("S3DiskProcessor: Missing configuration");
    }

    this.s3 = new S3({
      apiVersion: "2006-03-01",
      signatureVersion: "v4",
      region: config?.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  public async process(): Promise<any> {
    const config = this.getConfig<S3DiskOptions>();
    const metadata = this.getMetadata();

    if (
      !config ||
      !config.accessKeyId ||
      !config.secretAccessKey ||
      !config.region ||
      !config.bucket
    ) {
      throw new Error("S3DiskProcessor: Missing configuration");
    }

    const params: PutObjectRequest = {
      Bucket: config.bucket,
      Key: `${config.folder ? `${config.folder}/` : ""}${metadata.originalName}`,
      Body: (await this.getResized()) ?? this.getBuffer(),
      ContentType: metadata.mimeType,
      ACL: config.acl ?? "public-read",
    };

    return this.s3
      .upload(params)
      .promise()
      .then(data => {
        return plainToClass(S3File, {
          ...this.getMetadata(),
          fileName: metadata.originalName,
          url: data.Location,
        });
      })
      .catch(err => new Error(err));
  }
}
