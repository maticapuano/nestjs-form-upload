import { ValidateBy, ValidationArguments, ValidationOptions } from "class-validator";
import { FileProcessorMetadata } from "../../interfaces/file-processor.interface";
import { parseArray } from "../../utils/parse-array.util";

export const HasExtension = (extensions: string[], validationOptions?: ValidationOptions) => {
  return ValidateBy({
    name: "hasExtension",
    constraints: [extensions, validationOptions],
    validator: {
      validate(value: FileProcessorMetadata, args: ValidationArguments) {
        const [extensions] = args.constraints;

        if (value) {
          const files = parseArray(value);

          return files.every(file => extensions.includes(file.extension));
        }

        return true;
      },
      defaultMessage: (validationArguments?: ValidationArguments) => {
        const allowedExtensions: string[] = parseArray(validationArguments?.constraints[0]);

        return `Allowed extensions are: ${allowedExtensions.join(", ")}`;
      },
    },
  });
};
