import { CredentialInterface } from "@/interfaces/AuthAttributes";
import useAlertStore from "@/stores/useAlertStore";
import useAuthStore from "@/stores/useAuthStore";
import axios from "axios";
import { storeToRefs } from "pinia";
import { useMutation } from "vue-query";
import { useRouter } from "vue-router";

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
  const { cleanup, setUnauthenticate } = useAuthStore();
  const { successAlert, errorAlert } = useAlertStore();
  const router = useRouter();

  return useMutation(
    (_: unknown) => {
      setUnauthenticate();
      router.push("/login");
      return axios.post("/api/logout");
    },
    {
      onSuccess: () => successAlert("Successfully logged out"),
      onError: () => {
        errorAlert("Failed to log out properly");
      },
      onSettled: () => {
        cleanup();
      },
    }
  );
}
