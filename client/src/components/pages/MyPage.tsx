import { Paper, Stack, Typography } from "@mui/material";
import { FormContainer, useForm } from "react-hook-form-mui";
import AccountManagementForm from "@/components/organisms/AccountManagementFragments/AccountManagementForm";
import { yupResolver } from "@hookform/resolvers/yup";
import { adminRegistrationFormSchema } from "@/validations/RegistrationFormValidation";
import useConfirm from "@/hooks/useConfirm";
import useAlerter from "@/hooks/useAlerter";
import { updateAuthData, uploadImage } from "@/services/AuthService";
import { useCallback, useEffect, useRef, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { UserAttributes, userInit } from "@/interfaces/AuthAttributes";
import { useNavigate } from "react-router-dom";
import DisabledComponentContextProvider from "@/providers/DisabledComponentContextProvider";
import Button from "../atoms/Button";
import OptionsContextProvider from "@/providers/OptionsContextProvider";
import { OptionsAttribute } from "@/interfaces/CommonInterface";
import { MembershipType } from "@/enums/membershipTypes";
import {
  getOptions,
  getOptionsWithBelongsToId,
} from "@/services/CommonService";

const { trial, individual, corporate, admin } = MembershipType;

const adminSchema = adminRegistrationFormSchema.pick([
  "name",
  "email",
  "image",
]);

const corporateSchema = adminRegistrationFormSchema.pick([
  "name",
  "email",
  "image",
  "sex",
  "birthday",
  "department_1",
  "department_2",
  "remarks",
]);

const individualSchema = adminRegistrationFormSchema.pick([
  "name",
  "email",
  "image",
  "sex",
  "birthday",
  "department_1",
  "department_2",
  "remarks",
]);

const trialSchema = adminRegistrationFormSchema.pick([
  "name",
  "email",
  "image",
  "sex",
  "birthday",
]);

const schemaGenerator = (type: MembershipType) => {
  if (type === admin) return adminSchema;
  if (type === corporate) return corporateSchema;
  if (type === individual) return individualSchema;
  if (type === trial) return trialSchema;
};

function MyPage() {
  const mounted = useRef(true);
  const navigate = useNavigate();
  const { isConfirmed } = useConfirm();
  const { successSnackbar, errorSnackbar, handleError } = useAlerter();
  const { authData, membershipTypeId, setAuthData } = useAuth();
  const [options, setOptions] = useState<OptionsAttribute>({});
  const formContext = useForm<UserAttributes>({
    mode: "onChange",
    defaultValues: authData ?? userInit,
    resolver: yupResolver(schemaGenerator(membershipTypeId || trial)),
  });

  const {
    formState: { isDirty, isValid, isSubmitting },
  } = formContext;

  const handleSubmit = formContext.handleSubmit(async (raw) => {
    const confirmed = await isConfirmed({
      title: "update",
      content: "update?",
    });

    if (confirmed) {
      try {
        const image = await uploadImage(raw.image);
        const res = await updateAuthData({...raw, image });

        successSnackbar(res.data.message);
        setAuthData(res.data.user);
        navigate("/home");
      } catch (e: any) {
        console.log(e.response);
        handleError(e, formContext);
      }
    }
  });

  const updateOptions = useCallback(
    async (
      optionFor: "parent_departments" | "child_departments",
      belongsToId: number
    ) => {
      formContext.setValue("department_2", 0);

      if (!belongsToId) {
        setOptions((o) => ({
          ...o,
          department_2: [{ id: 0, name: "部署１未選択" }],
        }));
        return;
      }

      const res = await getOptionsWithBelongsToId([
        {
          belongsTo: "department_id",
          id: belongsToId,
        },
      ]);

      setOptions((o) => ({
        ...o,
        department_2: [
          { id: 0, name: "未選択" },
          ...res.data.child_departments,
        ],
      }));
    },
    []
  );

  useEffect(() => {
    mounted.current = true;

    if (authData && membershipTypeId) {
      (async () => {
        try {
          const promise = [getOptions(["departments"])];

          if (authData.department_1)
            promise.push(
              getOptionsWithBelongsToId([
                {
                  belongsTo: "department_id",
                  id: authData.department_1,
                },
              ])
            );

          const res = await Promise.all(promise);

          setOptions({
            department_1: [
              { id: 0, name: "未選択" },
              ...res[0].data.departments,
            ],
            department_2: authData.department_1
              ? [{ id: 0, name: "未選択" }, ...res[1].data.child_departments]
              : [{ id: 0, name: "部署１未選択", selectionType: "disabled" }],
          });

          formContext.reset({
            name: authData?.name,
            image: authData?.image || null,
            email: authData?.email,
            sex: authData?.sex ?? 0,
            birthday: authData?.birthday,
            department_1: authData?.department_1 ?? 0,
            department_2: authData?.department_2 ?? 0,
            remarks: authData?.remarks,
          });
        } catch (e: any) {
          errorSnackbar(e.message);
        }
      })();
    }
    return () => {
      mounted.current = false;
    };
  }, [errorSnackbar, membershipTypeId, authData]);

  return (
    <Paper variant="outlined">
      <Stack spacing={3}>
        <Typography variant="sectiontitle2">アカウントを編集</Typography>
        <OptionsContextProvider options={options}>
          <DisabledComponentContextProvider value={isSubmitting} showLoading>
            <FormContainer
              formContext={formContext}
              handleSubmit={handleSubmit}
            >
              <AccountManagementForm
                mode="edit"
                personal
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

export default MyPage;
