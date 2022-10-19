import { ValidateBy, ValidationArguments, ValidationOptions } from "class-validator";
import { parseArray } from "../../utils/parse-array.util";

export const HasMimeFile = (mimes: string[], options?: ValidationOptions): PropertyDecorator => {
  return ValidateBy(
    {
      name: "HasMime",
      constraints: [mimes],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [mimes] = args.constraints;

          return value && parseArray(value).every(file => mimes.includes(file.mimeType));
        },

        defaultMessage(args: ValidationArguments): string {
          const [mimes] = args.constraints;
          const mimesAllowed = mimes.join(",");

          return `Field "${args.property}" does not contain file with allowed mime type. Allowed mime types: ${mimesAllowed}`;
        },
      },
    },
    options,
  );
};
