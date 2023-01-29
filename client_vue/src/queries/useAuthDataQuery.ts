import {
  AdminUserInterface,
  CorporateUserInterface,
  IndividualUserInterface,
  TrialUserInterface,
} from "@/interfaces/UserInterface";
import axios from "axios";
import { useQuery } from "vue-query";
import { MaybeRef } from "vue-query/lib/vue/types";

interface BEGetMeDataResponse {
  user:
    | AdminUserInterface
    | IndividualUserInterface
    | CorporateUserInterface
    | TrialUserInterface;
  users_count: {
    trial?: number;
    individual?: number;
    corporate?: number;
  };
  categories: unknown[];
  message?: string;
}

export default function (enabled: MaybeRef<boolean>) {
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
