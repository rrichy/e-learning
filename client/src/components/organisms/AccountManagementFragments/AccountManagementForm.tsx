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

const { trial, individual, corporate, admin } = MembershipType;

function AccountManagementForm({
  personal,
  mode,
  optionUpdateFn,
}: {
  personal?: boolean;
  mode: "add" | "edit";
  optionUpdateFn?: (
    a: "parent_departments" | "child_departments",
    d: number
  ) => void;
}) {
  const { membershipTypeId } = useAuth();

  if (personal)
    return (
      <Stack spacing={2} p={2} alignItems="center">
        <ImageDropzone name="image" label="アイコン画像" />
        <TextField name="name" label="氏名" />
        <TextField name="email" label="メールアドレス" />
        {membershipTypeId !== MembershipType.admin && (
          <>
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
            {/* <Selection name="membership_type_id" label="権限(membership)" />
            <Selection
              name="affiliation_id"
              label="所属"
              onChange={
                optionUpdateFn
                  ? (e) => optionUpdateFn("parent_departments", e as number)
                  : undefined
              }
            /> */}
            <Selection
              name="department_1"
              label="部署１"
              onChange={
                optionUpdateFn
                  ? (e) => optionUpdateFn("child_departments", e as number)
                  : undefined
              }
            />
            <Selection name="department_2" label="部署２" />
            <TextField name="remarks" label="備考" multiline rows={4} />
          </>
        )}
      </Stack>
    );

  return (
    <Stack spacing={2} p={2} alignItems="center">
      <ImageDropzone name="image" label="アイコン画像" />
      <TextField name="name" label="氏名" />
      <TextField name="email" label="メールアドレス" />
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

      {mode === "add" ? (
        <>
          <TextField name="password" label="パスワード" type="password" />
          <TextField
            name="password_confirmation"
            label="パスワード（確認）"
            type="password"
          />
        </>
      ) : (
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

      {membershipTypeId === MembershipType.admin && (
        <>
          <Selection
            name="membership_type_id"
            label="権限"
            options={[
              { id: trial, name: "トライアル" },
              { id: individual, name: "個人" },
              { id: corporate, name: "法人" },
              { id: admin, name: "管理者" },
            ]}
          />
          <Selection
            name="affiliation_id"
            label="所属"
            onChange={
              optionUpdateFn
                ? (e) => optionUpdateFn("parent_departments", e as number)
                : undefined
            }
          />
        </>
      )}
      <Selection
        name="department_1"
        label="部署１"
        onChange={
          optionUpdateFn
            ? (e) => optionUpdateFn("child_departments", e as number)
            : undefined
        }
      />
      <Selection name="department_2" label="部署２" />
      <TextField name="remarks" label="備考" multiline rows={4} />
    </Stack>
  );
}

export default AccountManagementForm;
