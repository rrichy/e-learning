import Button from "@/components/atoms/Button";
import MyPageAdmin from "@/components/organisms/MyPageForms/MyPageAdmin";
import MyPageCorporateIndividual from "@/components/organisms/MyPageForms/MyPageCorporateIndividual";
import MyPageTrial from "@/components/organisms/MyPageForms/MyPageTrial";
import { MembershipType } from "@/enums/membershipTypes";
import useAlerter from "@/hooks/useAlerter";
import useAuth from "@/hooks/useAuth";
import useConfirm from "@/hooks/useConfirm";
import { UserAttributes, userInit } from "@/interfaces/AuthAttributes";
import DisabledComponentContextProvider from "@/providers/DisabledComponentContextProvider";
import { updateAuthData, uploadImage } from "@/services/AuthService";
import { adminRegistrationFormSchema } from "@/validations/RegistrationFormValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Paper, Stack, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { FormContainer } from "react-hook-form-mui";
import { useNavigate } from "react-router-dom";

const { admin, corporate, individual, trial } = MembershipType;

function MyPage() {
  const navigate = useNavigate();
  const { authData, membershipTypeId, setAuthData } = useAuth();
  const { isConfirmed } = useConfirm();
  const { successSnackbar, handleError } = useAlerter();
  const fields = fieldsGenerator(membershipTypeId);

  const form = useForm<UserAttributes>({
    mode: "onChange",
    defaultValues: userInit,
    resolver: yupResolver(adminRegistrationFormSchema.pick(fields)),
  });

  const [filled, setFilled] = useState(false);
  const saveMutation = useMutation(
    async (raw: UserAttributes) => {
      const image = await uploadImage(raw.image);
      return updateAuthData({ ...raw, image });
    },
    {
      onSuccess: (res) => {
        successSnackbar(res.data.message);
        setAuthData(res.data.user);
        navigate("/home");
      },
      onError: (e: any) => handleError(e, form),
    }
  );

  const handleSubmit = form.handleSubmit(async (raw: UserAttributes) => {
    const confirmed = await isConfirmed({
      title: "update",
      content: "update?",
    });
    if (confirmed) saveMutation.mutate(raw);
  });

  useEffect(() => {
    if (authData && !filled) {
      form.reset(
        fields.reduce(
          (acc: object, k) => ({
            ...acc,
            [k]:
              ["department_1", "department_2"].includes(k) &&
              authData[k] === null
                ? 0
                : authData[k],
          }),
          {}
        )
      );
      setFilled(true);
    }
  }, [filled, authData, fields, form]);

  const {
    formState: { isDirty, isValid, isSubmitting },
  } = form;

  return (
    <Paper variant="outlined">
      <Stack spacing={3}>
        <DisabledComponentContextProvider
          value={isSubmitting || saveMutation.isLoading}
          showLoading
        >
          <Typography variant="sectiontitle2">アカウントを編集</Typography>
          <FormContainer formContext={form} handleSubmit={handleSubmit}>
            {renderForm(membershipTypeId, form)}
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

function renderForm(
  membershipTypeId: MembershipType,
  form: UseFormReturn<any, any>
) {
  switch (membershipTypeId) {
    case admin:
      return <MyPageAdmin />;
    case corporate:
    case individual:
      return <MyPageCorporateIndividual form={form} />;
    case trial:
      return <MyPageTrial />;
    default:
      return null;
  }
}

function fieldsGenerator(type: MembershipType) {
  const fields: (keyof UserAttributes)[] = ["name", "email", "image"];
  switch (type) {
    case corporate:
    case individual: {
      fields.push("sex", "birthday", "department_1", "department_2", "remarks");
      break;
    }
    case trial: {
      fields.push("sex", "birthday");
      break;
    }
  }

  return fields;
}
