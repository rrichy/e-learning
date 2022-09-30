import { OrderType } from "@/interfaces/CommonInterface";
import { NoticeFormAttribute } from "@/validations/NoticeFormValidation";
// import { NoticeFormAttribute } from "@/validations/NoticeFormValidation";
import { destroy, get, post, put } from "./ApiService";

const url_prefix = "/api/notice";

export const indexNotice = (
  page: number = 1,
  per_page: number = 10,
  sort: string = "id",
  order: OrderType = "desc"
) => {
  return get(
    `${url_prefix}?page=${page}&per_page=${per_page}&order=${order}&sort=${sort}`
  );
};

export const showNotice = (id: number) => {
  return get(`${url_prefix}/${id}`);
};

export const storeNotice = (data: NoticeFormAttribute) => {
  return post(url_prefix, data);
};

export const updateNotice = (id: number, data: NoticeFormAttribute) => {
  return put(`${url_prefix}/${id}`, data);
};

export const destroyNotice = (ids: number[]) => {
  return destroy(`${url_prefix}/${ids.join(",")}`);
};
