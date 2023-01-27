// import { MembershipType } from "@/enums/membershipTypes";
// import { OptionAttribute } from "@/interfaces/CommonInterface";
import Yup from "./localizedYup";

const { string, number, date, ref } = Yup;

export interface RegistrationFormAttributes {
  name: string;
  email: string;
  sex: number;
  birthday: Date | null;
  password: string;
  password_confirmation: string;
}

export const registrationFormSchema = Yup.object({
  // image: mixed().label("アイコン画像").nullable(),
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

// export const adminRegistrationFormSchema = registrationFormSchema.shape({
//   membership_type_id: number().label("権限").selectionId(),
//   affiliation_id: number()
//     .label("所属")
//     .when("membership_type_id", {
//       is: (val: number | string) => +val === MembershipType.corporate,
//       then: (schema) => schema.selectionId(true),
//       otherwise: (schema) => schema.selectionId(),
//     }),
//   department_1: number().label("部署1").selectionId(),
//   department_2: number().label("部署2").selectionId(),
//   remarks: string().label("備考"),
// });

// export interface AdminRegistrationFormAttribute
//   extends InferType<typeof adminRegistrationFormSchema> {}

export const registrationFormInit: RegistrationFormAttributes = {
  // image: null,
  name: "",
  email: "",
  sex: 0,
  birthday: null,
  password: "",
  password_confirmation: "",
};

// export const adminRegistrationFormInit: AdminRegistrationFormAttribute = {
//   ...registrationFormInit,
//   membership_type_id: MembershipType.individual,
//   affiliation_id: 0,
//   department_1: 0,
//   department_2: 0,
//   remarks: "",
// };

// export type DepartmentOptionsType = (OptionAttribute & {
//   affiliation_id: number;
// })[];
// export type ChildDepartmentOptionsType = (OptionAttribute & {
//   affiliation_id: number;
//   parent_id: number;
// })[];
