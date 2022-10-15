export interface FileProcessorOptions extends FileProcessorMetadata {
  buffer: Buffer;
  config: Record<string, any>;
}

export interface FileProcessorMetadata {
  originalName: string;
  encoding: string;
  mimeType: string;
  extension: string;
}
