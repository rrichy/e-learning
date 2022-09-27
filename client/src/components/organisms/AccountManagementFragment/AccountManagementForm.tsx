import { Stack } from "@mui/material";
import {
  DatePicker,
  Selection,
  TextField,
  ImageDropzone,
} from "../../molecules/LabeledHookForms";
import Button from "@/components/atoms/Button";
import Labeler from "@/components/molecules/Labeler";
import useAuth from "@/hooks/useAuth";
import { MembershipType } from "@/enums/membershipTypes";

function AccountManagementForm({
  viewable,
  isCreate,
  isDetail,
  isEdit,
}: {
  viewable: boolean;
  isCreate?: boolean;
  isDetail?: boolean;
  isEdit?: boolean;
}) {
  const { membershipTypeId } = useAuth();

  return (
    <>
      <Stack spacing={2} p={2} alignItems="center">
        <ImageDropzone name="image" label="アイコン画像" />
        <TextField name="name" label="氏名" />
        <TextField name="email" label="メールアドレス" />
        {membershipTypeId !== MembershipType.admin && (
          <>
            <Selection name="sex" label="性別" />
            <DatePicker name="birthday" label="生年月日" maxDate={new Date()} />
          </>
        )}

        {isCreate && (
          <>
            <TextField name="password" label="パスワード" type="password" />
            <TextField
              name="password_confirmation"
              label="パスワード（確認）"
              type="password"
            />
          </>
        )}
        {isEdit && (
          <>
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
          </>
        )}
        {membershipTypeId !== MembershipType.admin && (
          <>
            <Selection name="membership_type_id" label="権限(membership)" />
            <Selection name="affiliation_id" label="所属" />
            <Selection name="department_id.1" label="部署１" />
            <Selection name="department_id.2" label="部署２" />
            <TextField name="remarks" label="remarks" multiline rows={4} />
          </>
        )}
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
    </>
  );
}

export default AccountManagementForm;
