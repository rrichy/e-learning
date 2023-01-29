import { CredentialInterface } from "@/interfaces/AuthAttributes";
import useAuthStore from "@/stores/useAuthStore";
import axios from "axios";
import { storeToRefs } from "pinia";
import { useMutation } from "vue-query";

export function useLoginMutation() {
  const { isAuthenticated, token } = storeToRefs(useAuthStore());
  return useMutation(
    (credentials: CredentialInterface) => axios.post("/api/login", credentials),
    {
      onSuccess: (res) => {
        isAuthenticated.value = true;
        token.value = res.data.access_token;
        localStorage.setItem("access_token", res.data.access_token);
        axios.defaults.headers.common["Authorization"] =
          "Bearer " + token.value;
      },
    }
  );
}

export function useLogoutMutation() {
  const { logout } = useAuthStore();
  return useMutation((_: unknown) => axios.post("/api/logout"), {
    onSettled: logout,
  });
}
