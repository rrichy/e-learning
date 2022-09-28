import { get } from "./ApiService";

export const getOptions = (fields: string[]) => {
  return get("/api/options?fields=" + fields.join(","));
};

export const getOptionsWithBelongsToId = (
  fields: { belongsTo: string; id: number }[]
) => {
  return get(
    `/api/options?${fields
      .map(({ belongsTo, id }) => `${belongsTo}=${id}`)
      .join("&")}`
  );
};
