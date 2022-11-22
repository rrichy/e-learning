import Button from "@/components/atoms/Button";
import {
  ImageDropzone,
  TextField,
} from "@/components/molecules/LabeledHookForms";
import Labeler from "@/components/molecules/Labeler";
import { Stack } from "@mui/material";

function MyPageAdmin() {
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
    </Stack>
  );
}

export default MyPageAdmin;
