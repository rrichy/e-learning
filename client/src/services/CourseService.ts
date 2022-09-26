import { CourseFormAttribute } from "@/validations/CourseFormValidation";
import { destroy, get, post, put } from "./ApiService";

const url_prefix = "/api/course";

export const indexCourse = (status: "public" | "private" | "both" = "both") => {
  return get(`${url_prefix}?status=${status}`);
};

export const showCourse = (id: number) => {
  return get(`${url_prefix}/${id}`);
};

export const storeCourse = (data: CourseFormAttribute) => {
  return post(url_prefix, data);
};

export const updateCourse = (id: number, data: CourseFormAttribute) => {
  return put(`${url_prefix}/${id}`, data);
};

export const toggleCourses = (status: "public" | "private", ids: number[]) => {
  return put(`${url_prefix}/toggle`, { status, ids });
};

export const massDestroyCourse = (ids: number[]) => {
  return destroy(`${url_prefix}/${ids.join(",")}`);
};

export const massUpdateCoursePriority = (
  payload: {
    category_id: number;
    changes: { id: number; priority: number }[];
  }[]
) => {
  return put(`${url_prefix}/mass`, { payload });
};
