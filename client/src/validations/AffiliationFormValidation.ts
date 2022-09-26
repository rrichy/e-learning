import Yup from "./localizedYup";

const { string, number } = Yup;

export const affiliationFormSchema = Yup.object({
  name: string().label("所属名").required(),
  priority: number().label("並び順").required(),
});

export interface AffiliationFormAttribute {
  name: string;
  priority: string | null;
}

export type AffiliationFormAttributeWithId = AffiliationFormAttribute & {
  id: number;
};

export const affiliationFormInit: AffiliationFormAttribute = {
  name: "",
  priority: null,
};
