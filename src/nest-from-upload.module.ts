import { DynamicModule, Global, Module } from "@nestjs/common";
import { globalConfig } from "./config/global.config";
import { InjectConfig } from "./constants/inject-config.constant";
import { FileUploadOptions } from "./interfaces/file-upload-options.interface";

@Global()
@Module({
  providers: [
    {
      provide: InjectConfig,
      useValue: globalConfig,
    },
  ],
})
export class NestFormUploadModule {
  public static config(options: FileUploadOptions): DynamicModule {
    return {
      module: NestFormUploadModule,
      providers: [
        {
          provide: InjectConfig,
          useValue: options,
        },
      ],
    };
  }
}
