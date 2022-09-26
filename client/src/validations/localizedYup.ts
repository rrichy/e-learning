import * as yup from "yup";

yup.addMethod(yup.string, "name", function name(message?: string) {
  return this.matches(
    /^[一-龠ぁ-ゔァ-ヴーa-zA-Zａ-ｚＡ-Ｚ々〆〤 ]+$/u,
    message ?? "${path}Must be a valid name from add method"
  );
});

yup.addMethod(yup.string, "furigana", function furigana(message?: string) {
  return this.matches(
    /^[ぁ-ゔ]+|[ァ-ヴー]+/u,
    message ?? "${path}Must be furigana from add method"
  );
});

yup.addMethod(yup.string, "password", function password(message?: string) {
  return this.min(
    8,
    message ?? "${path}は8～16文字の範囲である必要がございます"
  )
    .max(16, message ?? "${path}は8～16文字の範囲である必要がございます")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]+$/u,
      message ??
        "${path}には、大文字、小文字、番号と記号を1つ以上含めていただく必要がございます。"
    );
});

yup.addMethod(
  yup.number,
  "selectionId",
  function selectionId(required?: false, message?: string) {
    return this.min(
      Number(!!required),
      message ?? "選択から１つをお選びください。"
    );
  }
);

yup.setLocale({
  mixed: {
    required: "${path}は、必ず入力してください。",
    notType: "${path}は、必ず入力してください。",
  },
  string: {
    matches: "${path}には、有効な正規表現を指定してください。",
    min: "${path}は、${min}文字以上にしてください。",
    max: "${path}は、${max}文字以下にしてください。",
    email: "${path}は、有効なメールアドレス形式で指定してください。",
  },
  number: {
    min: "${path}には、${min}以上の数字を指定してください。",
    max: "${path}には、${max}以下の数字を指定してください。",
  },
});

export default yup;
