import Button from "@/components/atoms/Button";
import {
  DatePicker,
  ImageDropzone,
  Selection,
  TextField,
} from "@/components/molecules/LabeledHookForms";
import Labeler from "@/components/molecules/Labeler";
import { Stack } from "@mui/material";

function MyPageTrial() {
  return (
    <Stack spacing={2} p={2} alignItems="center">
      <ImageDropzone name="image" label="アイコン画像" />
      <TextField name="name" label="氏名" />
      <TextField name="email" label="メールアドレス" />
      <Labeler label="パスワード">
        <Button
          variant="contained"
          color="secondary"
          rounded
          fit
          type="button"
          to="/change-password"
        >
          パスワードを変更する
        </Button>
      </Labeler>
      <Selection
        name="sex"
        label="性別"
        options={[
          { id: 0, name: "未選択", selectionType: "disabled" },
          { id: 1, name: "男性" },
          { id: 2, name: "女性" },
        ]}
      />
      <DatePicker name="birthday" label="生年月日" maxDate={new Date()} />
    </Stack>
  );
}

export default MyPageTrial;
