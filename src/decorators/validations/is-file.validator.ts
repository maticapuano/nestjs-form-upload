import { ValidateBy, ValidationArguments, ValidationOptions } from "class-validator";
import { FileProcessor } from "../../processors/file-processor";

export const IsFile = (options?: ValidationOptions): PropertyDecorator => {
  return ValidateBy(
    {
      name: "IsFile",
      constraints: [],
      validator: {
        validate(value: any) {
          return value && FileProcessor.isFile(value);
        },

        defaultMessage(args: ValidationArguments): string {
          return `Field "${args.property}" does not contain file`;
        },
      },
    },
    options,
  );
};
