import { OrderType } from "@/interfaces/CommonInterface";
import { TestAttributes } from "@/validations/CourseFormValidation";
import { destroy, get, post, put } from "./ApiService";

const url_prefix = "/api/chapter";

// export const indexTest = (
//   page: number = 1,
//   per_page: number = 10,
//   sort: string = "id",
//   order: OrderType = "desc"
// ) => {
//   return get(
//     `${url_prefix}?page=${page}&per_page=${per_page}&order=${order}&sort=${sort}`
//   );
// };

export const showTest = (id: number, type: 1 | 2) => {
  return get(`${url_prefix}/${id}?test_type=${type}`);
};

// export const storeTest = (data: TestAttributes) => {
//   return post(url_prefix, data);
// };

// export const updateTest = (id: number, data: TestAttributes) => {
//   return put(`${url_prefix}/${id}`, data);
// };

// export const destroyTest = (ids: number[]) => {
//   return destroy(`${url_prefix}/${ids.join(",")}`);
// };

// export const duplicateTest = (id: number) => {
//   return post(`${url_prefix}/${id}/duplicate`);
// }
