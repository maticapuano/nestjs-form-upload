import { ValidateBy, ValidationArguments, ValidationOptions } from "class-validator";
import { FileProcessor } from "../../processors/file-processor";

export const IsFileArray = (options?: ValidationOptions): PropertyDecorator => {
  return ValidateBy(
    {
      name: "IsFileArray",
      constraints: [],
      validator: {
        validate(value) {
          return value && Array.isArray(value) && value.every(FileProcessor.isFile);
        },

        defaultMessage(args: ValidationArguments): string {
          return `Field "${args.property}" does not contain array of files`;
        },
      },
    },
    options,
  );
};
