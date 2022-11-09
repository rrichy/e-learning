import { Box, Collapse, Paper, Stack } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useMemo, useState } from "react";
import Button from "@/components/atoms/Button";
import {
  ConditionalDateRange,
  Selection,
  TextField,
} from "@/components/molecules/LabeledHookForms";
import DateRange from "@/components/atoms/HookForms/DateRange";
import Labeler from "@/components/molecules/Labeler";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  AccountManagementSearchAttributes,
  accountManagementSearchSchema,
  initAccountManagementDefault,
} from "@/validations/SearchFormValidation";
import { FormContainer, useForm } from "react-hook-form-mui";
import { useQuery } from "@tanstack/react-query";
import { getOptions } from "@/services/CommonService";
import { OptionAttribute } from "@/interfaces/CommonInterface";
import { MembershipType, MembershipTypeJp } from "@/enums/membershipTypes";

const buttonStyle = (open: boolean) => {
  if (open)
    return {
      height: "60px !important",
      "& svg": {
        transition: "200ms transform",
        transform: "rotate(180deg)",
      },
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    };

  return {
    height: "60px !important",
    "& svg": {
      transition: "200ms transform",
    },
  };
};

const { corporate, individual, trial } = MembershipType;

export const useOptions = () =>
  useQuery(
    ["affiliations", "departments", "child_departments", "courses"],
    async () => {
      const res = await getOptions([
        "affiliations",
        "departments",
        "child_departments",
        "courses",
      ]);
      return res.data;
    },
    {
      staleTime: 10_000,
      refetchOnWindowFocus: false,
    }
  );

function AccountManagementSearchAccordion({
  onSubmit,
}: {
  onSubmit: (r: AccountManagementSearchAttributes) => void;
}) {
  const { data, isLoading } = useOptions();
  const form = useForm<AccountManagementSearchAttributes>({
    mode: "onChange",
    defaultValues: initAccountManagementDefault,
    resolver: yupResolver(accountManagementSearchSchema),
  });
  const [open, setOpen] = useState(false);

  const memberships = useMemo(
    () =>
      [
        { id: 0, name: "未選択", selectionType: "disabled" },
        { id: corporate, name: MembershipTypeJp[corporate] },
        { id: individual, name: MembershipTypeJp[individual] },
        { id: trial, name: MembershipTypeJp[trial] },
      ] as OptionAttribute[],
    []
  );

  const [affiliation_id, department_1] = form.watch([
    "affiliation_id",
    "department_1",
  ]);

  const affiliations = useMemo(() => {
    if (isLoading)
      return [{ id: 0, name: "未選択", selectionType: "disabled" }];
    return [
      { id: 0, name: "未選択", selectionType: "disabled" },
      ...(data ? data.affiliations : []),
    ] as OptionAttribute[];
  }, [data, isLoading]);

  const departments = useMemo(() => {
    const depts: (OptionAttribute & { affiliation_id: number })[] = [];

    if (isLoading) {
      depts.push({
        id: 0,
        name: "未選択",
        selectionType: "disabled",
        affiliation_id: 0,
      });
    } else {
      depts.push(
        { id: 0, name: "未選択", selectionType: "disabled", affiliation_id: 0 },
        ...(data
          ? !affiliation_id
            ? data.departments
            : data.departments.filter(
                (a: any) => a.affiliation_id === affiliation_id
              )
          : [])
      );
    }

    return depts;
  }, [data, isLoading, affiliation_id]);

  const child_departments = useMemo(() => {
    const depts: (OptionAttribute & {
      affiliation_id: number;
      parent_id: number;
    })[] = [];

    if (isLoading) {
      depts.push({
        id: 0,
        name: "未選択",
        selectionType: "disabled",
        affiliation_id: 0,
        parent_id: 0,
      });
    } else {
      depts.push(
        {
          id: 0,
          name: "未選択",
          selectionType: "disabled",
          affiliation_id: 0,
          parent_id: 0,
        },

        ...(data
          ? !(department_1 || affiliation_id)
            ? data.child_departments
            : data.child_departments.filter(
                (a: any) => a.parent_id === department_1
              )
          : [])
      );
    }

    return depts;
  }, [data, isLoading, affiliation_id, department_1]);

  const { isDirty, isValid } = form.formState;

  return (
    <Box>
      <Button
        variant="contained"
        sx={buttonStyle(open)}
        onClick={() => setOpen(!open)}
        endIcon={<ExpandMoreIcon fontSize="large" />}
      >
        アカウント検索
      </Button>
      <Collapse in={open}>
        <Paper
          variant="outlined"
          sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        >
          <FormContainer
            formContext={form}
            handleSubmit={form.handleSubmit(onSubmit)}
          >
            <Stack spacing={2} alignItems="center">
              <Selection
                name="membership_type_id"
                label="権限"
                options={memberships}
              />
              <Selection
                name="affiliation_id"
                label="所属"
                options={affiliations}
                onChange={() => {
                  form.setValue("department_1", 0);
                  form.setValue("department_2", 0);
                }}
              />
              <Selection
                name="department_1"
                label="部署１"
                options={departments}
                onChange={(department_1) => {
                  const department = departments.find(
                    ({ id }) => id === department_1
                  );
                  form.setValue(
                    "affiliation_id",
                    department?.affiliation_id ?? 0
                  );
                  form.setValue("department_2", 0);
                }}
              />
              <Selection
                name="department_2"
                label="部署２"
                options={child_departments}
                onChange={(department_2) => {
                  const department = child_departments.find(
                    ({ id }) => id === department_2
                  );
                  form.setValue(
                    "affiliation_id",
                    department?.affiliation_id ?? 0
                  );
                  form.setValue("department_1", department?.parent_id ?? 0);
                }}
              />
              <TextField name="name" label="氏名" />
              <TextField name="email" label="メールアドレス" />
              <TextField name="remarks" label="備考" />
              <Labeler label="登録日">
                <DateRange
                  minDateProps={{
                    name: "registered_min_date",
                  }}
                  maxDateProps={{
                    name: "registered_max_date",
                  }}
                />
              </Labeler>
              <ConditionalDateRange
                label="最終ログイン日"
                radioName="never_logged_in"
                radioLabel="未ログイン"
                radioValue={1}
                dateRangeValue={2}
                DateRangeProps={{
                  minDateProps: { name: "logged_in_min_date" },
                  maxDateProps: { name: "logged_in_max_date" },
                }}
              />
            </Stack>
            <Stack direction="row" spacing={2} p={3} justifyContent="center">
              <Button
                large
                rounded
                color="dull"
                variant="outlined"
                type="button"
                onClick={() => {
                  form.reset(initAccountManagementDefault);
                  form.handleSubmit(onSubmit)();
                }}
              >
                コース名
              </Button>
              <Button
                large
                rounded
                color="secondary"
                variant="contained"
                disabled={!isDirty || !isValid}
              >
                検索
              </Button>
            </Stack>
          </FormContainer>
        </Paper>
      </Collapse>
    </Box>
  );
}

export default AccountManagementSearchAccordion;
