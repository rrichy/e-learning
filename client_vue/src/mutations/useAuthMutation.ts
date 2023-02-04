import { CredentialInterface } from "@/interfaces/AuthAttributes";
import { MyPageAttributes } from "@/interfaces/Forms/MyPageFormAttributes";
import useAlertStore from "@/stores/useAlertStore";
import useAuthStore from "@/stores/useAuthStore";
import axios from "axios";
import { useMutation, useQueryClient } from "vue-query";
import { useRouter } from "vue-router";

export function useLoginMutation() {
  const store = useAuthStore();
  return useMutation(
    (credentials: CredentialInterface) => axios.post("/api/login", credentials),
    {
      onSuccess: (response: { data: { access_token: string } }) => {
        const token = response.data.access_token;
        store.$patch({
          token,
          isAuthenticated: true,
        });
        localStorage.setItem("access_token", token);
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      },
    }
  );
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const store = useAuthStore();
  const { successAlert, errorAlert } = useAlertStore();
  const { push } = useRouter();

  return useMutation(
    (_: unknown) => {
      store.$patch({ isAuthenticated: false });
      push("/login");
      return axios.post("/api/logout");
    },
    {
      onSuccess: () => successAlert("Successfully logged out"),
      onError: () => {
        errorAlert("Failed to log out properly");
      },
      onSettled: () => {
        store.cleanup();
        queryClient.invalidateQueries();
      },
    }
  );
}

export function useUpdateAuthMutation() {
  const queryClient = useQueryClient();
  return useMutation(
    (values: MyPageAttributes) => {
      const form = new FormData();

      form.append("_method", "put");
      form.append("name", values.name);
      form.append("email", values.email);
      form.append("image", values.image[0]);
      return axios.post("/api/me", form);
    },
    {
      onSuccess: () => queryClient.invalidateQueries("authenticated-user-data"),
    }
  );
}
