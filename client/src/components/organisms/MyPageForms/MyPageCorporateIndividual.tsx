import Button from "@/components/atoms/Button";
import {
  DatePicker,
  ImageDropzone,
  Selection,
  TextField,
} from "@/components/molecules/LabeledHookForms";
import Labeler from "@/components/molecules/Labeler";
import { OptionsAttribute } from "@/interfaces/CommonInterface";
import { getOptions } from "@/services/CommonService";
import { ChildDepartmentOptionsType } from "@/validations/RegistrationFormValidation";
import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { UseFormReturn } from "react-hook-form";

function MyPageCorporateIndividual({
  form,
}: {
  form: UseFormReturn<any, any>;
}) {
  const { data, isFetching } = useQuery(
    ["departments-options"],
    async () => {
      const res = await getOptions(["departments", "child_departments"]);
      return res.data as OptionsAttribute;
    },
    {
      staleTime: 10_000,
      refetchOnWindowFocus: false,
    }
  );

  const department_1 = form.watch("department_1");

  const child_departments = useMemo(() => {
    const depts: ChildDepartmentOptionsType = [];

    if (isFetching || !data?.child_departments) {
      depts.push({
        id: 0,
        name: "未選択",
        affiliation_id: 0,
        parent_id: 0,
      });
    } else {
      const child_departments =
        data?.child_departments as ChildDepartmentOptionsType;
      depts.push(
        {
          id: 0,
          name: "未選択",
          affiliation_id: 0,
          parent_id: 0,
        },

        ...(!department_1
          ? child_departments
          : child_departments.filter((a: any) => a.parent_id === department_1))
      );
    }

    return depts;
  }, [data?.child_departments, isFetching, department_1]);

  const updateOptions = async (
    name: "department_1" | "department_2",
    value: number
  ) => {
    if (name === "department_1") form.setValue("department_2", 0);
    else {
      const department = child_departments.find(({ id }) => id === value);
      form.setValue("department_1", department?.parent_id ?? 0);
    }
  };

  return (
    <Stack spacing={2} p={2} alignItems="center">
      <ImageDropzone name="image" label="アイコン画像" />
      <TextField name="name" label="氏名" />
      <TextField name="email" label="メールアドレス" />
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
      <Selection
        name="department_1"
        label="部署１"
        options={[{ id: 0, name: "未選択" }, ...(data?.departments ?? [])]}
        onChange={(e) => updateOptions("department_1", e as number)}
      />
      <Selection
        name="department_2"
        label="部署２"
        options={child_departments}
        onChange={(e) => updateOptions("department_2", e as number)}
      />
      <TextField name="remarks" label="備考" multiline rows={4} />
    </Stack>
  );
}

export default MyPageCorporateIndividual;
