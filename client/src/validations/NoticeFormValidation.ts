import { array, InferType } from "yup";
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

export const noticeFormSchema = Yup.object({
  subject: string().label("件名").required(),
  content: string().label("内容").required(),
  posting_method: array(number()).label("掲載方法").min(1),
  date_publish_start: string().label("掲載開始日").required(),
  date_publish_end: string().label("掲載終了日").required(),
  signature_id: number().label("署名").required().selectionId(),
});

export interface NoticeFormAttribute extends InferType<typeof noticeFormSchema> {};

// export type SignatureFormAttributeWithId = SignatureFormAttribute & {
//   id: number;
// };

export const noticeFormInit: NoticeFormAttribute = {
  subject: "",
  content: "",
  posting_method: [],
  date_publish_start: "",
  date_publish_end: "",
  signature_id: 0,
};