import { OrderType } from "@/interfaces/CommonInterface";
import { AdminRegistrationFormAttribute } from "@/validations/RegistrationFormValidation";
import { destroy, get, post, put } from "./ApiService";

const url_prefix = "/api/account";

export const indexAccount = (
  page: number = 1,
  per_page: number = 10,
  sort: string = "id",
  order: OrderType = "desc"
) => {
  return get(
    `${url_prefix}?page=${page}&per_page=${per_page}&order=${order}&sort=${sort}`
  );
};

export const showAccount = (id: number, parsed: boolean = false) => {
  return get(`${url_prefix}/${id}?parsed=${parsed}`);
};

export const storeAccount = (data: AdminRegistrationFormAttribute) => {
  return post(url_prefix, data);
};

export const updateAccount = (
  id: number,
  data: AdminRegistrationFormAttribute
) => {
  return put(`${url_prefix}/${id}`, data);
};

export const destroyAccount = (ids: number[]) => {
  return destroy(`${url_prefix}/${ids.join(",")}`);
};
