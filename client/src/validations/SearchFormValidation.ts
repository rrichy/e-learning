import Yup from "./localizedYup";

const { string, number, object } = Yup;

const accountBaseSearchSchema = object({
  affiliation_id: number().optional(),
  name: string().optional(),
  email: string().optional(),
  remarks: string().optional(),
  category_id: number().optional(),
  never_logged_in: number(),
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
});

interface AccountBaseSearchAttributes {
  affiliation_id: number;
  name: string;
  email: string;
  remarks: string;
  category_id: number;
  never_logged_in: number;
  logged_in_min_date: null | string;
  logged_in_max_date: null | string;
}

const initBaseSearchDefault: AccountBaseSearchAttributes = {
  affiliation_id: 0,
  name: "",
  email: "",
  remarks: "",
  category_id: 0,
  never_logged_in: 0,
  logged_in_min_date: null,
  logged_in_max_date: null,
};

// AttendeeSearchForm
export const courseAttendeeSearchSchema = accountBaseSearchSchema.shape({
  narrowed_by: number().optional(),
});

export interface CourseAttendeeSearchAttributes
  extends AccountBaseSearchAttributes {
  narrowed_by: number;
}

export const initCourseAttendeeDefault: CourseAttendeeSearchAttributes = {
  ...initBaseSearchDefault,
  narrowed_by: 0,
};

// AccountManagementSearchForm
export const accountManagementSearchSchema = accountBaseSearchSchema.shape({
  membership_type_id: number().optional(),
  department_1: number().optional(),
  department_2: number().optional(),
  registered_min_date: string().nullable(),
  registered_max_date: string().nullable(),
});

export interface AccountManagementSearchAttributes
  extends AccountBaseSearchAttributes {
  membership_type_id: number;
  department_1: number;
  department_2: number;
  registered_min_date: null | string;
  registered_max_date: null | string;
}

export const initAccountManagementDefault: AccountManagementSearchAttributes = {
  ...initBaseSearchDefault,
  membership_type_id: 0,
  department_1: 0,
  department_2: 0,
  registered_min_date: null,
  registered_max_date: null,
};
