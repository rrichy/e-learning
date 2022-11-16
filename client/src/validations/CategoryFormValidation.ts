import Yup from "./localizedYup";

const { string, number, date, array, object } = Yup;

export const categoryFormSchema = Yup.object({
  name: string().label("部署名").required(),
  priority: number().label("並び順").required(),
  start_period: string().label("開始期間").required(),
  end_period: string().label("終了期間").required(),
  child_categories: array(
    object({
      name: string().label("子部署名").required(),
      priority: number().label("並び順").required(),
    })
  ),
});

export interface CategoryFormAttribute {
  id?: number;
  name: string;
  priority: string | null;
  start_period: Date | null;
  end_period: Date | null;
  parent_id: number | null;
  child_categories: {
    id?: number;
    name: string;
    priority: string | null;
  }[];
}

export type CategoryFormAttributeWithId = CategoryFormAttribute & {
  id: number;
};

export const categoryFormInit: CategoryFormAttribute = {
  name: "",
  priority: null,
  start_period: null,
  end_period: null,
  parent_id: null,
  child_categories: [],
};
