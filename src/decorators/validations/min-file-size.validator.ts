import { ValidationOptions, ValidateBy, ValidationArguments } from "class-validator";
import { parseArray } from "../../utils/parse-array.util";

export const MinFileSize = (minSize: number, options?: ValidationOptions): PropertyDecorator => {
  return ValidateBy(
    {
      name: "MinFileSize",
      constraints: [minSize],
      validator: {
        validate(value, args: ValidationArguments) {
          const [minSize] = args.constraints;

          return value && parseArray(value).every(file => file.buffer.length >= minSize);
        },

        defaultMessage(args: ValidationArguments): string {
          const [minSize] = args.constraints;

          return `Field "${args.property}" does not contain file with size greater than ${minSize} bytes`;
        },
      },
    },
    options,
  );
};
