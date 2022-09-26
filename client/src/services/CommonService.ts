import { get } from "./ApiService";

export const getOptions = (fields: string[]) => {
  return get("/api/options?fields=" + fields.join(","));
};
