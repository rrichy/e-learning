import { Paper, Stack, Typography } from "@mui/material";
import { FormContainer, useForm } from "react-hook-form-mui";
import AccountManagementForm from "@/components/organisms/AccountManagementFragment/AccountManagementForm";
import { yupResolver } from "@hookform/resolvers/yup";
import { registrationFormSchema } from "@/validations/RegistrationFormValidation";
import useConfirm from "@/hooks/useConfirm";
import useAlerter from "@/hooks/useAlerter";
import { updateAuthData } from "@/services/AuthService";
import { useEffect, useRef } from "react";
import useAuth from "@/hooks/useAuth";
import { UserAttributes } from "@/interfaces/AuthAttributes";
import { useNavigate } from "react-router-dom";
import DisabledComponentContextProvider from "@/providers/DisabledComponentContextProvider";
import Button from "../atoms/Button";

function MyPage() {
  const mounted = useRef(true);
  const navigate = useNavigate();
  const { isConfirmed } = useConfirm();
  const { successSnackbar, errorSnackbar, handleError } = useAlerter();
  const { authData, setAuthData } = useAuth();
  const formContext = useForm<Pick<UserAttributes, "name" | "image" | "email">>(
    {
      mode: "onChange",
      defaultValues: { name: "", image: null, email: "" },
      resolver: yupResolver(
        registrationFormSchema.pick(["name", "email", "image"])
      ),
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
          const res = await updateAuthData(raw);

          successSnackbar(res.data.message);
          setAuthData(res.data.user);
          navigate("/home");
        } catch (e: any) {
          handleError(e, formContext);
        }
      }
    },
    (a, b) => console.log({ a, b })
  );

  useEffect(() => {
    mounted.current = true;

    formContext.reset({
      name: authData?.name,
      image: authData?.image || null,
      email: authData?.email,
    });

    return () => {
      mounted.current = false;
    };
  }, [errorSnackbar]);

  return (
    <Paper variant="outlined">
      <Stack spacing={3}>
        <Typography variant="sectiontitle2">アカウントを編集</Typography>
        <DisabledComponentContextProvider value={isSubmitting} showLoading>
          <FormContainer formContext={formContext} handleSubmit={handleSubmit}>
            <AccountManagementForm viewable={true} isEdit />
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
      </Stack>
    </Paper>
  );
}

export default MyPage;
