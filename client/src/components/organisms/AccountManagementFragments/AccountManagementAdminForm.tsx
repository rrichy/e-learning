import { Stack } from "@mui/material";
import {
  TextField,
  ImageDropzone,
} from "../../molecules/LabeledHookForms";
import Button from "@/components/atoms/Button";
import Labeler from "@/components/molecules/Labeler";
import useAuth from "@/hooks/useAuth";
import { MembershipType } from "@/enums/membershipTypes";

const { trial, individual, corporate, admin } = MembershipType;

function AccountManagementAdminForm({
  personal,
  mode,
}: {
  personal?: boolean;
  mode: "add" | "edit";
}) {
  const { membershipTypeId } = useAuth();

  return (
    <>
      {personal && (
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
      )}
    </>
  );
}

export default AccountManagementAdminForm;
