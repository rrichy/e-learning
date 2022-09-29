import { Paper, Stack, Typography } from "@mui/material";
import { FormContainer, useForm } from "react-hook-form-mui";
import AccountManagementForm from "@/components/organisms/AccountManagementFragment/AccountManagementForm";
import DisabledComponentContextProvider from "@/providers/DisabledComponentContextProvider";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useConfirm from "@/hooks/useConfirm";
import useAlerter from "@/hooks/useAlerter";
import {
  AdminRegistrationFormAttribute,
  adminRegistrationFormInit,
  adminRegistrationFormSchema,
} from "@/validations/RegistrationFormValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  getOptions,
  getOptionsWithBelongsToId,
} from "@/services/CommonService";
import {
  showAccount,
  storeAccount,
  updateAccount,
} from "@/services/AccountService";
import {
  OptionAttribute,
  OptionsAttribute,
} from "@/interfaces/CommonInterface";
import OptionsContextProvider from "@/providers/OptionsContextProvider";
import { MembershipType } from "@/enums/membershipTypes";
import useAuth from "@/hooks/useAuth";
import Button from "@/components/atoms/Button";

const { trial, individual, corporate, admin } = MembershipType;

function AccountManagementAddEdit() {
  const mounted = useRef(true);
  const navigate = useNavigate();
  const { state, pathname } = useLocation();
  const { accountId } = useParams();
  const [initialized, setInitialized] = useState(false);
  const [options, setOptions] = useState<OptionsAttribute>({
    membership_type_id: [
      { id: trial, name: "トライアル" },
      { id: individual, name: "個人" },
      { id: corporate, name: "法人" },
      { id: admin, name: "管理者" },
    ],
    sex: [
      { id: 0, name: "未選択", selectionType: "disabled" },
      { id: 1, name: "男性" },
      { id: 2, name: "女性" },
    ],
  });
  // const [departments, setDepartments] = useState([{ id: 0, name: "未選択", selectionType: "disabled" }]);
  const { isConfirmed } = useConfirm();
  const { successSnackbar, errorSnackbar, handleError } = useAlerter();
  const { membershipTypeId } = useAuth();
  const isCreate =
    pathname
      .split("/")
      .filter((a) => a)
      .pop() === "create";
  const formContext = useForm<AdminRegistrationFormAttribute>({
    mode: "onChange",
    defaultValues: adminRegistrationFormInit,
    resolver: yupResolver(
      adminRegistrationFormSchema.omit(
        isCreate ? [] : ["password", "password_confirmation"]
      )
    ),
  });

  const {
    formState: { isDirty, isValid, isSubmitting },
  } = formContext;

  const handleSubmit = formContext.handleSubmit(
    async (raw) => {
      const confirmed = await isConfirmed({
        title: isCreate ? "create" : "update",
        content: isCreate ? "create" : "update?",
      });

      if (confirmed) {
        try {
          const res = await (isCreate
            ? storeAccount(raw)
            : updateAccount(+accountId!, raw));
          successSnackbar(res.data.message);
          navigate("/account-management");
        } catch (e: any) {
          handleError(e, formContext);
        }
      }
    },
    (a, b) => console.log({ a, b })
  );

  const updateOptions = useCallback(
    async (
      optionFor: "parent_departments" | "child_departments",
      belongsToId: number
    ) => {
      const fromAffiliation = optionFor === "parent_departments";

      if (fromAffiliation) formContext.setValue("department_1", 0);
      formContext.setValue("department_2", 0);

      if (!belongsToId) {
        if (fromAffiliation) {
          setOptions((o) => ({
            ...o,
            department_1: [{ id: 0, name: "未選択" }],
            department_2: [{ id: 0, name: "部署１未選択" }],
          }));
        } else {
          setOptions((o) => ({
            ...o,
            department_2: [{ id: 0, name: "未選択" }],
          }));
        }

        return;
      }

      const res = await getOptionsWithBelongsToId([
        {
          belongsTo: fromAffiliation ? "affiliation_id" : "department_id",
          id: belongsToId,
        },
      ]);

      if (fromAffiliation) {
        setOptions((o) => ({
          ...o,
          department_1: [{ id: 0, name: "未選択" }, ...res.data.departments],
          department_2: [{ id: 0, name: "部署１未選択" }],
        }));
      } else {
        setOptions((o) => ({
          ...o,
          department_2: [
            { id: 0, name: "未選択" },
            ...res.data.child_departments,
          ],
        }));
      }
    },
    []
  );

  useEffect(() => {
    mounted.current = true;

    (async () => {
      try {
        // resetting formcontext
        let shouldFetch = false;
        let account: AdminRegistrationFormAttribute & { id?: number } =
          adminRegistrationFormInit;
        const promise = [
          getOptions([
            membershipTypeId === admin ? "affiliations" : "departments",
          ]),
        ];

        if (!isCreate) {
          if (!state) {
            shouldFetch = true;
            promise.push(showAccount(+accountId!));
          } else
            account = state as AdminRegistrationFormAttribute & { id: number };
        }
        const res = await Promise.all(promise);

        if (!isCreate) {
          if (shouldFetch) {
            const { departments, affiliation_id, ...data } = res[1].data.data;
            formContext.reset({
              ...data,
              affiliation_id: affiliation_id ?? 0,
              department_1: departments[0] ?? 0,
              department_2: departments[1] ?? 0,
            });
          } else formContext.reset(account);
        }

        // fetching options for department_1 and department_2
        // scenarios: [admin] no affiliation_id; affiliation_id; affiliation_id + department_1;
        // scenarios: [corporate] no department_1; department_1;
        if (membershipTypeId === admin) {
          const [affiliation_id, department_id] = formContext.getValues([
            "affiliation_id",
            "department_1",
          ]);
          const fields: { belongsTo: string; id: number }[] = [];

          if (affiliation_id) {
            fields.push({ belongsTo: "affiliation_id", id: affiliation_id });
            if (department_id) {
              fields.push({ belongsTo: "department_id", id: department_id });
            }
          }

          const resID = await getOptionsWithBelongsToId(fields);
          setOptions((o) => ({
            ...o,
            affiliation_id: [
              { id: 0, name: "未選択" },
              ...res[0].data.affiliations,
            ],
            department_1: affiliation_id
              ? [{ id: 0, name: "未選択" }, ...resID.data.departments]
              : [{ id: 0, name: "所属未選択", selectionType: "disabled" }],
            department_2: department_id
              ? [{ id: 0, name: "未選択" }, ...resID.data.child_departments]
              : [{ id: 0, name: "部署１未選択", selectionType: "disabled" }],
          }));
        } else {
          const department_id = formContext.getValues("department_1");

          if (department_id) {
            const resID = await getOptionsWithBelongsToId([
              { belongsTo: "department_id", id: department_id },
            ]);

            setOptions((o) => ({
              ...o,
              department_1: [
                { id: 0, name: "未選択" },
                ...res[0].data.departments,
              ],
              department_2: [
                { id: 0, name: "未選択" },
                ...resID.data.child_departments,
              ],
            }));
          } else {
            setOptions((o) => ({
              ...o,
              department_1: [
                { id: 0, name: "未選択" },
                ...res[0].data.departments,
              ],
              department_2: [
                { id: 0, name: "部署１未選択", selectionType: "disabled" },
              ],
            }));
          }
        }
      } catch (e: any) {
        errorSnackbar(e.message);
      } finally {
        setInitialized(true);
      }
    })();

    return () => {
      mounted.current = false;
    };
  }, [state, accountId, isCreate, membershipTypeId]);

  return (
    <Paper variant="outlined">
      <Stack spacing={3}>
        <Typography variant="sectiontitle2">アカウントを登録</Typography>
        <OptionsContextProvider options={options}>
          <DisabledComponentContextProvider value={isSubmitting} showLoading>
            <FormContainer
              formContext={formContext}
              handleSubmit={handleSubmit}
            >
              <AccountManagementForm
                mode={isCreate ? "add" : "edit"}
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
                  {isCreate ? "登録" : "編集"}
                </Button>
              </Stack>
            </FormContainer>
          </DisabledComponentContextProvider>
        </OptionsContextProvider>
      </Stack>
    </Paper>
  );
}

export default AccountManagementAddEdit;
