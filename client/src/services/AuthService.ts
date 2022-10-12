import { UserAttributes } from "@/interfaces/AuthAttributes";
import { RegistrationFormAttribute } from "@/validations/RegistrationFormValidation";
import { get, post, BEARER_TOKEN, put } from "./ApiService";

export const getBearerToken = () => localStorage.getItem(BEARER_TOKEN) || "";

export const setBearerToken = (token: string) =>
  localStorage.setItem(BEARER_TOKEN, token);

export const deleteBearerToken = () => localStorage.removeItem(BEARER_TOKEN);

export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  await get("/sanctum/csrf-cookie");
  const res = await post("/api/login", credentials);

  setBearerToken(res.data.access_token);
  return res;
};

export const getAuthData = () => {
  return get("/api/me");
};

export const updateAuthData = (payload: Partial<UserAttributes>) => {
  return put("/api/me", payload);
};

export const register = (payload: RegistrationFormAttribute) => {
  return post("/api/register", payload);
};

export const logout = () => {
  return post("/api/logout");
};

export const upload = (type: 'profile_image' | 'course_image' | 'chapter_video', id?: number) => {
  let url = `/api/upload?type=${type}`;

  if(id) url += `&user_id=${id}`;

  return get(url);
}

export const uploadImage = async (imageField: any) => {
  if (!imageField) return null;
  if (typeof imageField === "string") return imageField;

  const url = await upload("profile_image");
  await put(url.data, imageField[0], {
    headers: {
      "Content-Type": imageField[0].type,
    },
  }, true);
  
  return url.data.split("?")[0] as string;
}