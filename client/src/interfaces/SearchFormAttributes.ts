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
  never_logged_in: -1,
  logged_in_min_date: null,
  logged_in_max_date: null,
  narrowed_by: 0,
};
