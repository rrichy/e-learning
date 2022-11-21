import { Paper, Stack, Typography } from "@mui/material";
import { FormContainer, useForm } from "react-hook-form-mui";
import AccountManagementForm from "@/components/organisms/AccountManagementFragments/AccountManagementFormV2";
import DisabledComponentContextProvider from "@/providers/DisabledComponentContextProvider";
import { useNavigate, useParams } from "react-router-dom";
import useConfirm from "@/hooks/useConfirm";
import useAlerter from "@/hooks/useAlerter";
import {
  AdminRegistrationFormAttribute,
  adminRegistrationFormInit,
  adminRegistrationFormSchema,
} from "@/validations/RegistrationFormValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { showAccount, updateAccount } from "@/services/AccountService";
import OptionsContextProvider from "@/providers/OptionsContextProvider";
import Button from "@/components/atoms/Button";
import { uploadImage } from "@/services/AuthService";
import { useQuery } from "@tanstack/react-query";
import useAccountFormHelper from "@/hooks/pages/useAccountFormHelper";

function AccountManagementEdit() {
  const navigate = useNavigate();
  const { accountId } = useParams();
  const { isConfirmed } = useConfirm();
  const { successSnackbar, errorSnackbar, handleError } = useAlerter();

  const formContext = useForm<AdminRegistrationFormAttribute>({
    mode: "onChange",
    defaultValues: adminRegistrationFormInit,
    resolver: yupResolver(
      adminRegistrationFormSchema.omit(["password", "password_confirmation"])
    ),
  });

  const { options, updateOptions } = useAccountFormHelper(formContext);

  const { isFetching } = useQuery(
    ["account-details", +accountId!],
    () => showAccount(+accountId!),
    {
      refetchOnWindowFocus: false,
      onSuccess: ({ data }: any) => {
        formContext.reset({
          ...data.data,
          affiliation_id: data.data.affiliation_id ?? 0,
          department_1: data.data.department_1 ?? 0,
          department_2: data.data.department_2 ?? 0,
        });
      },
      onError: (e: any) => errorSnackbar(e.message),
    }
  );

  const {
    formState: { isDirty, isValid, isSubmitting },
  } = formContext;

  const handleSubmit = formContext.handleSubmit(
    async (raw) => {
      const confirmed = await isConfirmed({
        title: "update",
        content: "update?",
      });

      if (confirmed) {
        try {
          const image = await uploadImage(raw.image);
          const res = await updateAccount(+accountId!, { ...raw, image });
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
        <Typography variant="sectiontitle2">アカウントを"編集</Typography>
        <OptionsContextProvider options={options}>
          <DisabledComponentContextProvider
            showLoading
            value={isSubmitting || isFetching}
          >
            <FormContainer
              formContext={formContext}
              handleSubmit={handleSubmit}
            >
              <AccountManagementForm
                mode="edit"
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
                  編集
                </Button>
              </Stack>
            </FormContainer>
          </DisabledComponentContextProvider>
        </OptionsContextProvider>
      </Stack>
    </Paper>
  );
}

export default AccountManagementEdit;
