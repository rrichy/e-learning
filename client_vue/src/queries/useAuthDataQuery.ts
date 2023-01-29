import { UserAttributes } from "@/interfaces/AuthAttributes";
import axios from "axios";
import { Ref } from "vue";
import { useQuery } from "vue-query";

interface BEGetMeDataResponse {
  user: UserAttributes;
  users_count: {
    trial?: number;
    individual?: number;
    corporate?: number;
  };
  categories: unknown[];
  message?: string;
}

export default function (enabled: Ref<boolean>) {
  return useQuery(
    "authenticated-user-data",
    async () => {
      const response = await axios.get<BEGetMeDataResponse>("/api/me");
      return response.data;
    },
    {
      enabled,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      //   retry: 1,
      //   onError: () => {
      //     cleanup();
      //     replace("/login");
      //   },
    }
  );
}
