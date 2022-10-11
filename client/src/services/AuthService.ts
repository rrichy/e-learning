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
