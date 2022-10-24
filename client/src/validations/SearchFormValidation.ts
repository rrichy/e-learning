import Yup from "./localizedYup";

const { string, number, object } = Yup;

export const courseAttendeeSearchSchema = object({
  affiliation_id: number().optional(),
  name: string().optional(),
  email: string().optional(),
  remarks: string().optional(),
  category_id: number().optional(),
  never_logged_in: number().optional(),
  logged_in_min_date: string().when("never_logged_in", {
    is: (val: number | string) => val == 2,
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.nullable(),
  }),
  logged_in_max_date: string().when("never_logged_in", {
    is: (val: number | string) => val == 2,
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.nullable(),
  }),
  narrowed_by: number().optional(),
});

export interface CourseAttendeeSearchAttributes {
  affiliation_id: number;
  name: string;
  email: string;
  remarks: string;
  category_id: number;
  never_logged_in: number;
  logged_in_min_date: null | string;
  logged_in_max_date: null | string;
  narrowed_by: number;
}

export const initCourseAttendeeDefault: CourseAttendeeSearchAttributes = {
  affiliation_id: 0,
  name: "",
  email: "",
  remarks: "",
  category_id: 0,
  never_logged_in: 0,
  logged_in_min_date: null,
  logged_in_max_date: null,
  narrowed_by: 0,
};
