import Yup from "@/configs/yup";

const { string, mixed } = Yup;

export const adminMyPageFormSchema = Yup.object({
  image: mixed().label("アイコン画像").nullable(),
  name: string().label("氏名").required().name(),
  email: string().label("メールアドレス").required().email(),
});
