export enum MembershipType {
  guest,
  trial,
  individual,
  corporate,
  admin,
}

export enum MembershipTypeJp {
  "",
  "トライアル",
  "個人",
  "法人",
  "管理者",
}

export interface AdminUserInterface {
  name: string;
  image: string | null;
  email: string;
  membership_type_id: MembershipType.admin;
}

export interface IndividualUserInterface {
  name: string;
  image: string | null;
  email: string;
  sex: number;
  birthday: Date | null;
  department_1: number | null;
  department_2: number | null;
  remarks: string | null;
  membership_type_id: MembershipType.individual;
}

export interface CorporateUserInterface
  extends Omit<IndividualUserInterface, "membership_type_id"> {
  membership_type_id: MembershipType.corporate;
}

export interface TrialUserInterface {
  name: string;
  image: string | null;
  email: string;
  sex: number;
  birthday: Date | null;
  membership_type_id: MembershipType.trial;
}

export const adminUserInit: AdminUserInterface = {
  name: "",
  email: "",
  image: null,
  membership_type_id: MembershipType.admin,
};
