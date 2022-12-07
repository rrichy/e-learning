import { InferType } from "yup";
import Yup from "./localizedYup";

const { string, number, mixed, boolean } = Yup;

export const accountMultipleAddFormSchema = Yup.object({
  file: mixed().label("ファイル").required(),
  checked: boolean().required(),
  mail_template_id: number().selectionId(),
  title: string()
    .label("タイトル")
    .when("checked", {
      is: (val: boolean) => val == true,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.nullable(),
    }),
  content: string()
    .label("内容")
    .when("checked", {
      is: (val: boolean) => val == true,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.nullable(),
    }),
  signature_id: number()
    .label("署名選択")
    .nullable(true)
    .when("checked", {
      is: (val: boolean) => val == true,
      then: (schema) => schema.selectionId(true),
      otherwise: (schema) => schema.selectionId(),
    }),
});

export type AccountMultipleAddFormAttribute = InferType<
  typeof accountMultipleAddFormSchema
>;

export const accountMultipleAddFormInit: AccountMultipleAddFormAttribute = {
  file: null,
  checked: false,
  mail_template_id: 0,
  title: "",
  content: "",
  signature_id: 0,
};
