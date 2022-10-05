export interface UserAttributes {
  id?: number;
  name: string;
  email: string;
  birthday: string | null;
  sex: number | null;
  membership_type_id: number;
  remarks: string | null;
  // company_by_period_id: number | null;
  // company_department_id: number | null;
  // company_id: number | null;
  // education_id: number | null;
  // email: string;
  // experience: number | null;
  // first_name: string;
  // first_name_furigana: string;
  // id: number;
  image: string | null;
  // last_name: string;
  // last_name_furigana: string;
  // line: string | null;
  // prefecture: string | null;
  // promotion: string | null;
  // sex: number | null;
  // station: string | null;
  // status_id: number | null;
  // // tel: string | null;
  created_at: Date | null;
  last_login_date: Date | null;
  affiliation_id: number | null;
  department_1: number | null;
  department_2: number | null;
  affiliation_id_parsed?: string;
  department_1_parsed?: string;
  department_2_parsed?: string;
}

export interface AuthAttributes {
  isLoggedIn: boolean;
  data: UserAttributes | null;
  count: {
    individual?: number;
    corporate?: number;
    trial?: number;
  },
  categories: {
    id: number;
    name: string;
    courses: {
      id: number;
      title: string;
    }[]
  }[]
}

export const userInit: UserAttributes = {
  name: "",
  email: "",
  birthday: null,
  sex: 1,
  membership_type_id: 2,
  remarks: null,
  image: null,
  created_at: null,
  last_login_date: null,
  affiliation_id: null,
  department_1: null,
  department_2: null,
};
