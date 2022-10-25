import {
  FileUploadOptions,
  FileUploadOptionsBase,
} from "../interfaces/file-upload-options.interface";

export const parseConfig = (
  local: FileUploadOptionsBase & FileUploadOptions,
  global: FileUploadOptionsBase & FileUploadOptions,
): FileUploadOptionsBase & FileUploadOptions => {
  const extensions = [...(global.options?.extensions || []), ...(local.options?.extensions || [])];

  return {
    ...global,
    ...local,
    options: {
      folder: global.folder || null,
      ...global.options,
      ...local.options,
      extensions,
    },
  } as FileUploadOptions;
};
