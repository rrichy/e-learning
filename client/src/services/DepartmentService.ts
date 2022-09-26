import { OrderType } from "@/interfaces/CommonInterface";
import { DepartmentFormAttribute } from "@/validations/DepartmentFormValidation";
import { destroy, get, post, put } from "./ApiService";

const url_prefix = "/api/department";

export const indexDepartment = (
  page: number = 1,
  per_page: number = 10,
  sort: string = "id",
  order: OrderType = "desc"
) => {
  return get(
    `${url_prefix}?page=${page}&per_page=${per_page}&order=${order}&sort=${sort}`
  );
};

export const storeDepartment = (data: DepartmentFormAttribute) => {
  return post(url_prefix, data);
};

export const updateDepartment = (id: number, data: DepartmentFormAttribute) => {
  return put(`${url_prefix}/${id}`, data);
};

export const destroyDepartment = (ids: number[]) => {
  return destroy(`${url_prefix}/${ids.join(",")}`);
};
