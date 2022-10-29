import { ValidateBy, ValidationArguments, ValidationOptions } from "class-validator";
import { FileProcessor } from "../../processors/file-processor";

export const IsFile = (options?: ValidationOptions): PropertyDecorator => {
  return ValidateBy(
    {
      name: "IsFile",
      constraints: [],
      validator: {
        validate(value) {
          if (options && options.each) {
            if (!Array.isArray(value)) {
              return [value].every(item => FileProcessor.isFile(item));
            }

            return Array.isArray(value) && value.every(item => FileProcessor.isFile(item));
          }

          return !Array.isArray(value) && FileProcessor.isFile(value);
        },

        defaultMessage(args: ValidationArguments): string {
          return options && options.each
            ? `${args.property} Each value must be a file`
            : `${args.property} Value must be a file`;
        },
      },
    },
    options,
  );
};
