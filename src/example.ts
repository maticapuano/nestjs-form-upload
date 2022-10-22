import { Body, Controller, Module, Post, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { writeFileSync } from "fs";
import { FileUpload } from "./decorators/file-upload.decorator";
import { HasMimeFile } from "./decorators/validations/has-mime.validator";
import { IsFileArray } from "./decorators/validations/is-file-array.validator";
import { IsFile } from "./decorators/validations/is-file.validator";
import { FileUploadProvider } from "./enums/file-upload-provider.enum";
import { FormUploadModule } from "./nest-from-upload.module";
import { MemoryFile } from "./processors/implementations/memory/dtos/memory-file-response.dto";

export class AppDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  public name: string;

  @IsNotEmpty()
  @IsString({})
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsFileArray()
  @HasMimeFile(["image/jpeg", "image/png"])
  public photo: MemoryFile[];

  @IsNotEmpty()
  @IsFile()
  @HasMimeFile(["image/jpeg", "image/png"])
  public photoCover: MemoryFile;
}

@Controller("/app")
export class AppController {
  @Post("/upload")
  @FileUpload({
    options: {
      resize: {
        photo: {
          width: 100,
          height: 100,
          quality: 30,
        },
        photoCover: {
          width: 1000,
          height: 1000,
          quality: 20,
        },
      },
    },
  })
  public async get(@Body() body: AppDto) {
    for (const photo of body.photo) {
      if (photo.resized) {
        writeFileSync(`${photo.originalName}_resized.${photo.extension}`, photo.resized);
      }

      if (body.photoCover.resized) {
        writeFileSync(`pepe_resized.${photo.extension}`, body.photoCover.resized);
      }
    }

    return {
      name: body.name,
      email: body.email,
      photos: Array.isArray(body.photo)
        ? body.photo.map(photo => photo.originalName)
        : // @ts-ignore
          body.photo.originalName,
    };
  }
}

@Module({
  imports: [
    FormUploadModule.register({
      provider: FileUploadProvider.MEMORY,
      options: {},
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.listen(3000);
};

bootstrap();
