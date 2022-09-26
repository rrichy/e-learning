import { InferType } from "yup";
import Yup from "./localizedYup";

const { string, number } = Yup;

export const signatureFormSchema = Yup.object({
  name: string().label("登録名").required(),
  from_name: string().required(),
  from_email: string().required(),
  content: string().label("署名").required(),
  priority: number().label("並び順").required(),
});

export type SignatureFormAttribute = Omit<
  InferType<typeof signatureFormSchema>,
  "priority"
> & {
  priority: string | null;
};

export type SignatureFormAttributeWithId = SignatureFormAttribute & {
  id: number;
};

export const signatureFormInit: SignatureFormAttribute = {
  name: "",
  from_name: "",
  from_email: "",
  content: "",
  priority: "",
};
