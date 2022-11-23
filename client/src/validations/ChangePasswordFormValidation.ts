import { InferType } from "yup";
import Yup from "./localizedYup";

const { string, ref } = Yup;

export const changePasswordFormSchema = Yup.object({
  old_password: string().required("古いパスワードは必須です。"),
  new_password: string()
    .required("新しいパスワードは必須です。")
    .min(6, "パスワードは大文字、小文字、数字、特殊文字を含む、6-30文字にする必要があります。")
    .max(30, "パスワードは大文字、小文字、数字、特殊文字を含む、6-30文字にする必要があります。")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]+$/u,
      "パスワードは大文字、小文字、数字、特殊文字を含む、6-30文字にする必要があります。"
    ),
  new_password_confirmation: string()
    .required("新しいパスワード（確認用）は、必ず指定してください。")
    .oneOf([ref("new_password")], "同じパスワードを入力してください。"),
});

export interface ChangePasswordFormAttribute
  extends InferType<typeof changePasswordFormSchema> {}

export const changePasswordFormInit: ChangePasswordFormAttribute = {
  old_password: "",
  new_password: "",
  new_password_confirmation: "",
};