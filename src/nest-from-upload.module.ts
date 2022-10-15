import { DynamicModule, Global, Module, Provider } from "@nestjs/common";
import { globalConfig } from "./config/global.config";
import { InjectConfig } from "./constants/inject-config.constant";
import { FileUploadDynamicOptions } from "./interfaces/file-upload-dynamic.interface";
import { FileUploadOptions } from "./interfaces/file-upload-options.interface";

@Global()
@Module({
  providers: [
    {
      provide: InjectConfig,
      useValue: globalConfig,
    },
  ],
  exports: [InjectConfig],
})
export class FormUploadModule {
  public static register(options: FileUploadOptions): DynamicModule {
    return {
      module: FormUploadModule,
      providers: [
        {
          provide: InjectConfig,
          useValue: options,
        },
      ],
    };
  }

  public static registerAsync(options: FileUploadDynamicOptions): DynamicModule {
    return {
      module: FormUploadModule,
      imports: options.imports,
      providers: [...this.createAsyncProviders(options)],
    };
  }

  private static createAsyncProviders(options: FileUploadDynamicOptions): Provider[] {
    if (options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    return [];
  }

  private static createAsyncOptionsProvider(options: FileUploadDynamicOptions): Provider {
    if (options.useFactory) {
      return {
        provide: InjectConfig,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    return {
      provide: InjectConfig,
      useValue: options,
    };
  }
}
