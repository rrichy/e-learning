import { OptionsAttribute } from "@/interfaces/CommonInterface";
import { useQuery } from "@tanstack/react-query";
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

export const getCacheableOptions = (...options: string[]) => {
  const { data, isFetching } = useQuery(
    options.map((o) => o + "-options"),
    async () => {
      const res = await getOptions(options);

      return res.data as OptionsAttribute;
    },
    {
      staleTime: 10_000,
      refetchOnWindowFocus: false,
    }
  );

  return { options: data ?? {}, fetchingOptions: isFetching };
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
