import { Paper, Stack, Typography } from "@mui/material";
import { FormContainer, useForm } from "react-hook-form-mui";
import AccountManagementForm from "@/components/organisms/AccountManagementFragments/AccountManagementFormV2";
import DisabledComponentContextProvider from "@/providers/DisabledComponentContextProvider";
import { useNavigate } from "react-router-dom";
import useConfirm from "@/hooks/useConfirm";
import useAlerter from "@/hooks/useAlerter";
import {
  AdminRegistrationFormAttribute,
  adminRegistrationFormInit,
  adminRegistrationFormSchema,
} from "@/validations/RegistrationFormValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { storeAccount } from "@/services/AccountService";
import OptionsContextProvider from "@/providers/OptionsContextProvider";
import Button from "@/components/atoms/Button";
import { uploadImage } from "@/services/AuthService";
import useAccountFormHelper from "@/hooks/pages/useAccountFormHelper";

function AccountManagementAdd() {
  const navigate = useNavigate();
  const { isConfirmed } = useConfirm();
  const { successSnackbar, handleError } = useAlerter();

  const formContext = useForm<AdminRegistrationFormAttribute>({
    mode: "onChange",
    defaultValues: adminRegistrationFormInit,
    resolver: yupResolver(adminRegistrationFormSchema),
  });

  const { options, updateOptions } = useAccountFormHelper(formContext);

  const {
    formState: { isDirty, isValid, isSubmitting },
  } = formContext;

  const handleSubmit = formContext.handleSubmit(
    async (raw) => {
      const confirmed = await isConfirmed({
        title: "create",
        content: "create",
      });

      if (confirmed) {
        try {
          const image = await uploadImage(raw.image);
          const res = await storeAccount({ ...raw, image });
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
        <Typography variant="sectiontitle2">アカウントを登録</Typography>
        <OptionsContextProvider options={options}>
          <DisabledComponentContextProvider showLoading value={isSubmitting}>
            <FormContainer
              formContext={formContext}
              handleSubmit={handleSubmit}
            >
              <AccountManagementForm
                mode="add"
                optionUpdateFn={updateOptions}
              />
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
                  登録
                </Button>
              </Stack>
            </FormContainer>
          </DisabledComponentContextProvider>
        </OptionsContextProvider>
      </Stack>
    </Paper>
  );
}

export default AccountManagementAdd;
