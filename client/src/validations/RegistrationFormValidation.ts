import { InferType } from "yup";
import Yup from "./localizedYup";

const { string, number, date, ref } = Yup;

export const registrationFormSchema = Yup.object({
  name: string().label("氏名").required().name(),
  email: string().label("メールアドレス").required().email(),
  sex: number().label("性別").required().selectionId(),
  birthday: date().label("生年月日").required(),
  password: string().label("パスワード").required().password(),
  password_confirmation: string()
    .label("パスワード（確認用)")
    .required()
    .oneOf([ref("password"), null], "パスワードと${path}が一致しません。"),
  // department_1: number().label("部署1").selectionId(),
  // department_2: number().label("部署2").selectionId(),
  // remarks: string().label("備考"),
});

export interface RegistrationFormAttribute
  extends Omit<InferType<typeof registrationFormSchema>, "birthday"> {
  birthday: Date | null;
}

export const registrationFormInit: RegistrationFormAttribute = {
  name: "",
  email: "",
  sex: 0,
  birthday: null,
  password: "",
  password_confirmation: "",
  // department_1: 0,
  // department_2: 0,
  // remarks: "",
};
