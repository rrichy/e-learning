import { OrderType } from "@/interfaces/CommonInterface";
import { CategoryFormAttribute } from "@/validations/CategoryFormValidation";
import { destroy, get, post, put } from "./ApiService";

const url_prefix = "/api/category";

export const indexCategory = (
  page: number = 1,
  per_page: number = 10,
  sort: string = "id",
  order: OrderType = "desc"
) => {
  return get(
    `${url_prefix}?page=${page}&per_page=${per_page}&order=${order}&sort=${sort}`
  );
};

export const storeCategory = (data: CategoryFormAttribute) => {
  return post(url_prefix, data);
};

export const updateCategory = (id: number, data: CategoryFormAttribute) => {
  return put(`${url_prefix}/${id}`, data);
};

export const destroyCategory = (ids: number[]) => {
  return destroy(`${url_prefix}/${ids.join(",")}`);
};

export const duplicateCategory = (id: number) => {
  return post(`${url_prefix}/${id}/duplicate`);
};
