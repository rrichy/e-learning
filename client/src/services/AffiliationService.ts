import { OrderType } from "@/interfaces/CommonInterface";
import { AffiliationFormAttribute } from "@/validations/AffiliationFormValidation";
import { destroy, get, post, put } from "./ApiService";

const url_prefix = "/api/affiliation";

export const indexAffiliation = (
  page: number = 1,
  per_page: number = 10,
  sort: string = "id",
  order: OrderType = "desc"
) => {
  return get(
    `${url_prefix}?page=${page}&per_page=${per_page}&order=${order}&sort=${sort}`
  );
};

export const storeAffiliation = (data: AffiliationFormAttribute) => {
  return post(url_prefix, data);
};

export const updateAffiliation = (
  id: number,
  data: AffiliationFormAttribute
) => {
  return put(`${url_prefix}/${id}`, data);
};

export const destroyAffiliation = (ids: number[]) => {
  return destroy(`${url_prefix}/${ids.join(",")}`);
};
