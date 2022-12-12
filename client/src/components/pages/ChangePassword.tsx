import { Paper, Stack, Typography } from "@mui/material";
import { FormContainer, useForm } from "react-hook-form-mui";
import { TextField } from "../molecules/LabeledHookForms";
import Button from "@/components/atoms/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  ChangePasswordFormAttribute,
  changePasswordFormInit,
  changePasswordFormSchema,
} from "@/validations/ChangePasswordFormValidation";
import useConfirm from "@/hooks/useConfirm";
import { useNavigate } from "react-router-dom";
import useAlerter from "@/hooks/useAlerter";
import DisabledComponentContextProvider from "@/providers/DisabledComponentContextProvider";
import { changePassword } from "@/services/AuthService";

function ChangePassword() {
  const navigate = useNavigate();
  const { isConfirmed } = useConfirm();
  const { successSnackbar, handleError } = useAlerter();

  const formContext = useForm<ChangePasswordFormAttribute>({
    mode: "onChange",
    defaultValues: changePasswordFormInit,
    resolver: yupResolver(changePasswordFormSchema),
  });

  const {
    formState: { isDirty, isValid, isSubmitting },
  } = formContext;

  const handleSubmit = formContext.handleSubmit(
    async (raw) => {
      const confirmed = await isConfirmed({
        title: "change password",
        content: "sure ka siszt?",
      });

      if (confirmed) {
        try {
          console.log("success");
          const res = await changePassword(raw);
          successSnackbar(res.data.message);
          navigate("/account-management");
        } catch (e: any) {
          handleError(e, formContext);
        }
      }
    },
    (a, b) => console.log({ a, b })
  );

  return (
    <Paper variant="outlined">
      <Stack spacing={3}>
        <DisabledComponentContextProvider showLoading value={isSubmitting}>
          <Typography variant="sectiontitle2">パスワード変更</Typography>
          <FormContainer formContext={formContext} handleSubmit={handleSubmit}>
            <Stack spacing={2} p={2} alignItems="center">
              <TextField
                name="old_password"
                label="現在のパスワード"
                type="password"
              />
              <TextField
                name="new_password"
                label="新パスワード"
                type="password"
              />
              <TextField
                name="new_password_confirmation"
                label="パスワード（確認用）"
                type="password"
              />
            </Stack>
            <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
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
                disabled={!(isDirty && isValid)}
              >
                パスワードを変更
              </Button>
            </Stack>
          </FormContainer>
        </DisabledComponentContextProvider>
      </Stack>
    </Paper>
  );
}

export default ChangePassword;
