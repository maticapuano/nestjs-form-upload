import busboy, { Busboy, FileInfo } from "busboy";
import {
  FileUploadOptions,
  FileUploadOptionsBase,
} from "../interfaces/file-upload-options.interface";
import appendField from "append-field";
import FileType from "file-type";
import { FileProcessorFactory } from "../processors/file-processor.factory";
import { Readable } from "../types/readable.type";
import { FileProcessor } from "../processors/file-processor";
import { BadRequestException } from "@nestjs/common";
import concat from "concat-stream";

export class FormProcessor {
  public instance: Busboy;
  public bodyFields: Record<string, string> = {};
  private files: FileProcessor<unknown>[] = [];
  private handleFunctionToResolve: Function;
  private handleFunctionToReject: Function;
  private fileStorePromises: Promise<void>[] = [];

  public constructor(
    private request: Record<string, any>,
    private options: FileUploadOptionsBase & FileUploadOptions,
  ) {
    this.instance = busboy({
      headers: this.request.headers,
    });

    this.instance.on("field", this.onField.bind(this));
    this.instance.on("file", this.onFile.bind(this));
    this.instance.on("error", this.rejectBadRequest.bind(this));
    this.instance.on("finish", this.processFileOnFinish.bind(this));
  }

  public handle(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.handleFunctionToReject = reject;
      this.handleFunctionToResolve = resolve;

      this.request.pipe(this.instance);
    });
  }

  private onField(name: string, value: string): void {
    appendField(this.bodyFields, name, value);
  }

  private async onFile(fileName: string, stream: Readable, meta: FileInfo): Promise<void> {
    const { filename } = meta;

    if (!filename) {
      stream.resume();

      return;
    }

    const processFile = this.processFile(stream, meta)
      .then(file => {
        if (stream.truncated) {
          this.instance.emit("fileSize");

          return;
        }

        this.files.push(file);

        appendField(this.bodyFields, fileName, file);
      })
      .catch(error => {
        this.rejectBadRequest(error);
      });

    this.fileStorePromises.push(processFile);
  }

  private async processFile(stream: Readable, meta: FileInfo): Promise<any> {
    return new Promise((resolve, reject) => {
      stream.pipe(
        concat({ encoding: "buffer" }, async (buffer: Buffer) => {
          const fileTypeFromBuffer = await FileType.fromBuffer(buffer);
          const fileTypeFromFileName = meta.filename.split(".").pop();
          const fileExtension = (fileTypeFromBuffer?.ext || fileTypeFromFileName) ?? "unknown";
          const mimeType = fileTypeFromBuffer?.mime ?? "application/octet-stream";

          if (
            this.options &&
            this.options.options &&
            this.options.options.extensions &&
            this.options.options.extensions.length &&
            !this.options.options.extensions.includes(fileExtension)
          ) {
            this.rejectBadRequest(`Sorry, ${fileExtension} files are not allowed`);
          }

          const factory = FileProcessorFactory.create(
            {
              originalName: meta.filename,
              encoding: meta.encoding,
              mimeType,
              extension: fileExtension,
              buffer,
              config: {
                provider: this.options.provider,
                ...this.options.options,
              },
            },
            this.options,
          );

          resolve(factory.process());
        }),
      );
    });
  }

  public async processFileOnFinish(): Promise<void> {
    await Promise.all(this.fileStorePromises);

    this.handleSuccess();
    this.handleFunctionToResolve(this.bodyFields);
  }

  private handleSuccess(): void {
    this.request.unpipe(this.instance);
    this.instance.removeAllListeners();
  }

  private rejectBadRequest(message: string): void {
    const error = new BadRequestException(null, message);

    this.handleFunctionToReject(error);
    this.handleSuccess();
  }
}
