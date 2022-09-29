import { InferType } from "yup";
import Yup from "./localizedYup";

const { string, number } = Yup;

export interface NoticeTableRowAttribute {
  id: number;
  author: string;
  subject: string;
  priority: number;
  publish_start: string;
  publish_end: string;
  shown_in_bulletin: boolean;
  shown_in_mail: boolean;
}

// export const noticeFormSchema = Yup.object({
//   name: string().label("登録名").required(),
//   from_name: string().required(),
//   from_email: string().required(),
//   content: string().label("署名").required(),
//   priority: number().label("並び順").required(),
// });

// export type SignatureFormAttribute = Omit<
//   InferType<typeof noticeFormSchema>,
//   "priority"
// > & {
//   priority: string | null;
// };

// export type SignatureFormAttributeWithId = SignatureFormAttribute & {
//   id: number;
// };

// export const signatureFormInit: SignatureFormAttribute = {
//   name: "",
//   from_name: "",
//   from_email: "",
//   content: "",
//   priority: "",
// };
