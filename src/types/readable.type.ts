import { Readable as ReadableStream } from "stream";

export type Readable = ReadableStream & {
  truncated: boolean;
};
