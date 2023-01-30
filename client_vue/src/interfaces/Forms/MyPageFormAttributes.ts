export interface AdminMyPageAttributes {
  name: string;
  email: string;
  image: string | null;
}

export const adminMyPageInit: AdminMyPageAttributes = {
  name: "",
  email: "",
  image: null,
};
