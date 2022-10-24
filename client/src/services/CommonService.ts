import { get } from "./ApiService";

export const getOptions = (
  fields: string[],
  options?: { [k: string]: any }
) => {
  let url = "/api/options?fields=" + fields.join(",");

  if (options) {
    const params = Object.entries(options)
      .reduce(
        (acc: string[], [key, value]) =>
          !value ? acc : [...acc, `${key}=${value}`],
        []
      )
      .join("&");

    url += "&" + params;
  }

  return get(url);
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
