import Yup from "./localizedYup";

const { string, number, array, object } = Yup;

export const departmentFormSchema = Yup.object({
  affiliation_id: number().label("所属名").required().selectionId(),
  name: string().label("部署名").required(),
  priority: number().label("並び順").required(),
  child_departments: array(
    object({
      name: string().label("子部署名").required(),
      priority: number().label("並び順").required(),
    })
  ),
});

export interface DepartmentFormAttribute {
  affiliation_id: number;
  name: string;
  priority: string | null;
  parent_id: number | null;
  child_departments: {
    name: string;
    priority: string | null;
  }[];
}

export type DepartmentFormAttributeWithId = DepartmentFormAttribute & {
  id: number;
};

export const departmentFormInit: DepartmentFormAttribute = {
  affiliation_id: 0,
  name: "",
  priority: null,
  parent_id: null,
  child_departments: [],
};
