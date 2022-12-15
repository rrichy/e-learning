import { MembershipType } from "@/enums/membershipTypes";
import { OptionAttribute } from "@/interfaces/CommonInterface";
import { useCacheableOptions } from "@/services/CommonService";
import {
  ChildDepartmentOptionsType,
  DepartmentOptionsType,
} from "@/validations/RegistrationFormValidation";
import { useMemo } from "react";
import { UseFormReturn } from "react-hook-form";

const { trial } = MembershipType;

function useAccountFormHelper(form: UseFormReturn<any, any>) {
  const { options, fetchingOptions } = useCacheableOptions(
    "affiliations",
    "departments",
    "child_departments"
  );

  const [membership_type_id, affiliation_id, department_1] = form.watch([
    "membership_type_id",
    "affiliation_id",
    "department_1",
  ]);

  const updateOptions = async (
    name:
      | "membership_type_id"
      | "affiliation_id"
      | "department_1"
      | "department_2",
    value: number
  ) => {
    if (name === "membership_type_id" && membership_type_id === trial) {
      form.setValue("affiliation_id", 0);
      form.setValue("department_1", 0);
      form.setValue("department_2", 0);
    } else if (name === "affiliation_id") {
      form.setValue("department_1", 0);
      form.setValue("department_2", 0);
    } else if (name === "department_1") {
      if (value !== 0) {
        const department = departments.find(({ id }) => id === value);
        form.setValue("affiliation_id", department?.affiliation_id ?? 0);
      }
      form.setValue("department_2", 0);
    } else if (name === "department_2") {
      if (value !== 0) {
        const department = child_departments.find(({ id }) => id === value);
        form.setValue("affiliation_id", department?.affiliation_id ?? 0);
        form.setValue("department_1", department?.parent_id ?? 0);
      }
    }
  };

  const affiliations = useMemo(() => {
    if (
      fetchingOptions ||
      !options?.affiliations ||
      membership_type_id === trial
    )
      return [{ id: 0, name: "未選択" }];
    return [
      { id: 0, name: "未選択" },
      ...options.affiliations,
    ] as OptionAttribute[];
  }, [fetchingOptions, options.affiliations, membership_type_id]);

  const departments = useMemo(() => {
    const depts: DepartmentOptionsType = [];

    if (
      fetchingOptions ||
      !options?.departments ||
      membership_type_id === trial
    ) {
      depts.push({
        id: 0,
        name: "未選択",
        affiliation_id: 0,
      });
    } else {
      const departments = options.departments as DepartmentOptionsType;
      depts.push(
        { id: 0, name: "未選択", affiliation_id: 0 },
        ...(!affiliation_id
          ? departments
          : departments.filter((a: any) => a.affiliation_id === affiliation_id))
      );
    }

    return depts;
  }, [
    membership_type_id,
    options?.departments,
    fetchingOptions,
    affiliation_id,
  ]);

  const child_departments = useMemo(() => {
    const depts: ChildDepartmentOptionsType = [];

    if (
      fetchingOptions ||
      !options?.child_departments ||
      membership_type_id === trial
    ) {
      depts.push({
        id: 0,
        name: "未選択",
        affiliation_id: 0,
        parent_id: 0,
      });
    } else {
      const child_departments =
        options?.child_departments as ChildDepartmentOptionsType;
      depts.push(
        {
          id: 0,
          name: "未選択",
          affiliation_id: 0,
          parent_id: 0,
        },

        ...(!(department_1 || affiliation_id)
          ? child_departments
          : child_departments.filter((a: any) => a.parent_id === department_1))
      );
    }

    return depts;
  }, [
    membership_type_id,
    options?.child_departments,
    fetchingOptions,
    affiliation_id,
    department_1,
  ]);

  return {
    options: {
      affiliation_id: affiliations,
      department_1: departments,
      department_2: child_departments,
    },
    updateOptions,
  };
}

export default useAccountFormHelper;
