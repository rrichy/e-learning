import { defineStore } from "pinia";
import { Ref, ref } from "vue";
import { useMutation, useQuery } from "vue-query";
import axios from "axios";
import {
  CredentialInterface,
  UserAttributes,
} from "../interfaces/AuthAttributes";

interface CountAttributes {
  individual?: number;
  corporate?: number;
  trial?: number;
}

interface CategoryAttributes {
  id: number;
  name: string;
  courses: {
    id: number;
    title: string;
  }[];
}

const useAuthStore = defineStore("auth-store", () => {
  const token: Ref<string | null> = ref(localStorage.getItem("access_token"));
  const isAuthenticated = ref(!!token.value);
  const data: Ref<UserAttributes | null> = ref(null);
  const count: Ref<CountAttributes> = ref({});
  const categories: Ref<CategoryAttributes[]> = ref([]);

  if (token.value) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token.value;
    getAuthData();
  }

  // Creates a login mutation
  function loginMutation() {
    return useMutation(
      (credentials: CredentialInterface) =>
        axios.post("/api/login", credentials),
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

  // Creates a logout mutation
  function logoutMutation() {
    return useMutation((_: unknown) => axios.post("/api/logout"), {
      onSettled: logout,
    });
  }

  // Creates a get data query
  function useGetAuthData(enabled = false) {
    return useQuery("authenticated-user-data", getAuthData, {
      enabled,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    });
  }

  // Attempts to get authenticated user's data with the stored token
  async function getAuthData() {
    try {
      const res = await axios.get("/api/me");
      isAuthenticated.value = true;
      data.value = res.data.user;
      count.value = res.data.users_count;
      categories.value = res.data.categories ?? [];
    } catch (e: unknown) {
      logout();
    }
  }

  function logout() {
    token.value = null;
    isAuthenticated.value = false;
    data.value = null;
    count.value = {};
    categories.value = [];
    localStorage.clear();
    axios.defaults.headers.common["Authorization"] = undefined;
  }

  return {
    isAuthenticated: () => isAuthenticated.value,
    data,
    loginMutation,
    logoutMutation,
    useGetAuthData,
    // getAuthData,
    logout,
    token,
  };
});

export default useAuthStore;
