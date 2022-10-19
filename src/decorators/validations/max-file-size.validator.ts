import { ValidateBy, ValidationArguments, ValidationOptions } from "class-validator";
import { parseArray } from "../../utils/parse-array.util";

export const MaxFileSize = (maxSize: number, options?: ValidationOptions): PropertyDecorator => {
  return ValidateBy(
    {
      name: "MaxFileSize",
      constraints: [maxSize],
      validator: {
        validate(value, args: ValidationArguments) {
          const [maxSize] = args.constraints;

          return value && parseArray(value).every(file => file.buffer.length <= maxSize);
        },

        defaultMessage(args: ValidationArguments): string {
          const [maxSize] = args.constraints;

          return `Field "${args.property}" does not contain file with size less than ${maxSize} bytes`;
        },
      },
    },
    options,
  );
};
