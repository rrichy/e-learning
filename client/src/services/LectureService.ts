import { destroy, get, post, put } from "./ApiService";

const url_prefix = "/api/chapter";

export const getLectures = (chapterId: number) => {
  return get(`${url_prefix}/${chapterId}/lecture`);
};
