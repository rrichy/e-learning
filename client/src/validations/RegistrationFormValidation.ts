import { MembershipType } from "@/enums/membershipTypes";
import { InferType } from "yup";
import Yup from "./localizedYup";

const { string, number, date, mixed, ref } = Yup;

export const registrationFormSchema = Yup.object({
  image: mixed().label("アイコン画像").nullable(),
  name: string().label("氏名").required().name(),
  email: string().label("メールアドレス").required().email(),
  sex: number().label("性別").required().selectionId(),
  birthday: date().label("生年月日").required(),
  password: string().label("パスワード").required().password(),
  password_confirmation: string()
    .label("パスワード（確認用)")
    .required()
    .oneOf([ref("password"), null], "パスワードと${path}が一致しません。"),
});

export const adminRegistrationFormSchema = registrationFormSchema.shape({
  membership_type_id: number().label("権限").selectionId(),
  affiliation_id: number().label("所属").selectionId(),
  department_1: number().label("部署1").selectionId(),
  department_2: number().label("部署2").selectionId(),
  remarks: string().label("備考"),
});

export interface RegistrationFormAttribute
  extends Omit<InferType<typeof registrationFormSchema>, "birthday"> {
  birthday: Date | null;
}

export interface AdminRegistrationFormAttribute
  extends Omit<InferType<typeof adminRegistrationFormSchema>, "birthday"> {
  birthday: Date | null;
}

export const registrationFormInit: RegistrationFormAttribute = {
  image: null,
  name: "",
  email: "",
  sex: 0,
  birthday: null,
  password: "",
  password_confirmation: "",
};

export const adminRegistrationFormInit: AdminRegistrationFormAttribute = {
  ...registrationFormInit,
  membership_type_id: MembershipType.individual,
  affiliation_id: 0,
  department_1: 0,
  department_2: 0,
  remarks: "",
};
