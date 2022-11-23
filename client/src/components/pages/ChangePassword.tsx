import { Paper, Stack, Typography } from "@mui/material";
import { FormContainer, useForm } from "react-hook-form-mui";
import { TextField } from "../molecules/LabeledHookForms";
import Button from "@/components/atoms/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChangePasswordFormAttribute, changePasswordFormInit, changePasswordFormSchema } from "@/validations/ChangePasswordFormValidation";
import useConfirm from "@/hooks/useConfirm";
import { useNavigate } from "react-router-dom";
import useAlerter from "@/hooks/useAlerter";
import DisabledComponentContextProvider from "@/providers/DisabledComponentContextProvider";
import { changePassword } from "@/services/AuthService";

function ChangePassword(){
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
      <DisabledComponentContextProvider showLoading value={isSubmitting}>
        <FormContainer formContext={formContext} handleSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Typography variant="sectiontitle2">Change Password</Typography>
            <Paper variant="sectionsubpaper">
              <Typography variant="sectiontitle3">Change Password</Typography>
              <Paper variant="outlined" sx={{ m: { xs: 2, md: 4 }, p: 2 }}>
                <Stack spacing={2} justifyContent="center">
                  <TextField
                    name="old_password"
                    label="Old Password"
                    type="password"
                  />
                  <TextField
                    name="new_password"
                    label="New Password"
                    type="password"
                  />
                  <TextField
                    name="new_password_confirmation"
                    label="New Password Confirmation"
                    type="password"
                  />
                </Stack>
              </Paper>
            </Paper>
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
                disabled={!(isDirty && isValid)}
              >
                Save
              </Button>
            </Stack>
          </Stack>
        </FormContainer>
      </DisabledComponentContextProvider>
    </Paper>
  );
}

export default ChangePassword;