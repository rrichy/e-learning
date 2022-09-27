import { Stack } from "@mui/material";
import {
  DatePicker,
  Selection,
  TextField,
} from "../../molecules/LabeledHookForms";
import Button from "@/components/atoms/Button";
import Labeler from "@/components/molecules/Labeler";

function AccountManagementForm({
  viewable,
  isCreate,
  isDetail,
  isEdit,
} : {
  viewable: boolean;
  isCreate?: boolean;
  isDetail?: boolean;
  isEdit?: boolean;
}) {
  return (
    <>
      <Stack spacing={2} p={2} alignItems="center">
        <TextField
          name="name"
          placeholder="Upload Image Here"
          label="アイコン画像"
        />
        <TextField
          name="name"
          placeholder="名前を入力"
          label="氏名"
        />
        <TextField
          name="name"
          placeholder="メールアドレスを入力"
          label="メールアドレス"
        />
        <Selection
          name="sex"
          label="性別"
        />
        <DatePicker
          name="birthday"
          label="生年月日"
          maxDate={new Date()}
        />
        {isCreate && (
        <>
          <TextField
            name="password"
            label="パスワード"
            type="password"
          />
          <TextField
            name="password_confirmation"
            label="パスワード（確認）"
            type="password"
          />
        </>)}
        {isEdit && (
        <>
          <Labeler label="パスワード">
            <Button
              variant="contained"
              color="secondary"
              sx={{ width: "fit-content", borderRadius: 6 }}
              to="/change-password"
            >
              パスワードを変更する
            </Button>
          </Labeler>
        </>)}
        <Selection
          name="sex"
          label="権限"
        />
        <Selection
          name="sex"
          label="所属"
        />
        <Selection
          name="sex"
          label="部署１"
        />
        <Selection
          name="sex"
          label="部署２"
        />
        <TextField
          name="remarks"
          placeholder="remarks"
          label="remarks"
          multiline
          rows={4}
        />
      </Stack>
      {isCreate && (
        <>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            color="dull"
            variant="outlined"
            rounded
            large
            type="button"
            to="/account-management"
          >
            キャンセル
          </Button>
          <Button
            color="secondary"
            variant="contained"
            rounded
            large
            type="submit"
            // disabled={!(isValid && isDirty)}
          >
            登録 (Confirmation [OK & Cancel])
          </Button>
        </Stack>
        </>
      )}
      {isDetail && (
        <>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            color="secondary"
            variant="contained"
            rounded
            large
            type="submit"
            // disabled={!(isValid && isDirty)}
            >
            edit
          </Button>
        </Stack>
        </>
      )}
      {isEdit && (
        <>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            color="dull"
            variant="outlined"
            rounded
            large
            type="button"
            to="/account-management"
          >
            キャンセル
          </Button>
          <Button
            color="secondary"
            variant="contained"
            rounded
            large
            type="submit"
            // disabled={!(isValid && isDirty)}
          >
            Update (Confirmation [OK & Cancel])
          </Button>
        </Stack>
        </>
      )}
    </>
  );
}

export default AccountManagementForm;