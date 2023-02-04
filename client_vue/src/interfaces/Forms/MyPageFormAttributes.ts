// tuple: first value is the File object, used for image manipulation
// second is used for displaying and passed to BE for saving
export type ImageFieldValue = [File | "", string | null];
// export type ImageFieldValue = string | null;

export interface MyPageAttributes {
  name: string;
  email: string;
  image: ImageFieldValue;
}

export interface AdminMyPageAttributes extends MyPageAttributes {}

export const adminMyPageInit: AdminMyPageAttributes = {
  name: "",
  email: "",
  // image: null,
  image: ["", null],
};
