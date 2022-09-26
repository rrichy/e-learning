import { OrderType } from "@/interfaces/CommonInterface";
import { OrganizeMailFormAttribute } from "@/validations/OrganizeMailFormValidation";
import { destroy, get, post, put } from "./ApiService";

const url_prefix = "/api/mail-template";

export const indexOrganizeMail = (
  page: number = 1,
  per_page: number = 10,
  sort: string = "id",
  order: OrderType = "desc"
) => {
  return get(
    `${url_prefix}?page=${page}&per_page=${per_page}&order=${order}&sort=${sort}`
  );
};

export const storeOrganizeMail = (data: OrganizeMailFormAttribute) => {
  return post(url_prefix, data);
};

export const updateOrganizeMail = (id: number, data: OrganizeMailFormAttribute) => {
  return put(`${url_prefix}/${id}`, data);
};

export const destroyOrganizeMail = (ids: number[]) => {
  return destroy(`${url_prefix}/${ids.join(",")}`);
};
