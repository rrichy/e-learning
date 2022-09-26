import { OrderType } from "@/interfaces/CommonInterface";
import { SignatureFormAttribute } from "@/validations/SignatureFormValidation";
import { destroy, get, post, put } from "./ApiService";

const url_prefix = "/api/signature";

export const indexSignature = (
  page: number = 1,
  per_page: number = 10,
  sort: string = "id",
  order: OrderType = "desc"
) => {
  return get(
    `${url_prefix}?page=${page}&per_page=${per_page}&order=${order}&sort=${sort}`
  );
};

export const storeSignature = (data: SignatureFormAttribute) => {
  return post(url_prefix, data);
};

export const updateSignature = (id: number, data: SignatureFormAttribute) => {
  return put(`${url_prefix}/${id}`, data);
};

export const destroySignature = (ids: number[]) => {
  return destroy(`${url_prefix}/${ids.join(",")}`);
};
