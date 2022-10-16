# @nestjs-form-upload

NestJS Form Upload is a module for NestJS that allows you to upload files using a form (multipart/form-data).

- Process files nested in a form
- Integration with `class-validator` and `class-transformer`
- Support for multiple files
- Process a single request `fields` and `files` at the same time
- Support image resizing and image compression (using `sharp`)

## Providers available

- Memory (default)

## Installation

```bash
$ npm install --save nestjs-form-upload
```

## Usage

### Import the module

```typescript
import { Module } from "@nestjs/common";
import { FormUploadModule, FileUploadProvider } from "@nestjs-form-upload";

@Module({
  imports: [
    FormUploadModule.register({
      provider: FileUploadProvider.MEMORY,
      options: {},
    }),
  ],
})
export class AppModule {}
```

### Usage

Add the `@FileUpload()` decorator to your controller method. The decorator will parse the request and extract the files and fields.

```typescript
import { Controller, Post, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs-form-upload";
import { FileUploadService } from "@nestjs-form-upload";

@Controller()
export class AppController {
  public constructor(private fileUploadService: AppService) {}

  @Post()
  @FileUpload({
    folder: "uploads",
    extensions: ["jpg", "png"],
    maxFileSize: 1024 * 1024 * 5, // exprese in bytes = 5MB
    maxFiles: 5, // max files to upload at the same time
  })
  public async create(@Body() file: FileUpload) {
    // Do something with the file

    return this.fileUploadService.create(file);
  }
}
```

### Image resizing

You can resize the image using the `resizes` option. The `resizes` option is an array of `ResizeOptions` objects.

Note: The `resizes` only works with images, if you try to resize a non-image file, the module will ignore the resize option and will upload the file as it is.

```typescript
import { Controller, Post, UseInterceptors } from "@nestjs/common";

export class AppController {
  @Post()
  @FileUpload({
    folder: "uploads",
    extensions: ["jpg", "png"],
    maxFileSize: 1024 * 1024 * 5, // exprese in bytes = 5MB
    maxFiles: 5, // max files to upload at the same time
    resizes: [
      {
        // if prefix is not provided, the file name the width and height ej: used 200x200-{originalFileName}
        prefix: "small", // will generate a file with the name small-{originalFileName}
        width: 200,
        height: 200,
        quality: 90,
      },
    ],
  })
  public async create(@Body() file: FileUpload) {
    // Do something with the file
  }
}
```

### Validation

If you want to validate the files, you can use the decorators.

Note: If need to validate an array of files, you need to use `each: true` property from `ValidationOptions`.

#### IsFile

Check if the file is a file.

```typescript
@IsFile(validationOptions?: ValidationOptions)
```

#### IsFiles

Checks an array of files, the same as `@IsFile({ each: true })` but with a better name.

```typescript
@IsFiles(validationOptions?: ValidationOptions)
```

### HasExtension

Check if the file has the specified extension.

```typescript
@HasExtension(extensions: string, validationOptions?: ValidationOptions)
```
