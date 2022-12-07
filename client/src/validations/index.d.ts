import { StringSchema as BaseStringSchema } from "yup";

declare module "yup" {
  interface StringSchema extends BaseStringSchema {
    furigana(message?: string): this;
    name(message?: string): this;
    password(message?: string): this;
  }

  interface NumberSchema {
    selectionId(required?: boolean, message?: number): this;
  }
}
