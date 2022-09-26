import { StringSchema, NumberSchema } from "yup";

declare module "yup" {
  interface StringSchema {
    furigana(message?: string): this;
    name(message?: string): this;
    password(message?: string): this;
  }

  interface NumberSchema {
    selectionId(required?: boolean, message?: number): this;
  }
}