import { InferType } from "yup";
import Yup from "./localizedYup";

const { string, number } = Yup;

export const organizeMailFormSchema = Yup.object({
  title: string().label("登録名").required(),
  content: string().label("署名").required(),
  signature_id: number().label("署名").selectionId(true),
  // priority: number().label("並び順"),
});

export type OrganizeMailFormAttribute = InferType<
  typeof organizeMailFormSchema
>;

export type OrganizeMailFormAttributeWithId = OrganizeMailFormAttribute & {
  id: number;
  priority?: number | null;
};

export const organizeMailFormInit: OrganizeMailFormAttribute = {
  title: "",
  content: "",
  signature_id: 0,
  // priority: "",
};
