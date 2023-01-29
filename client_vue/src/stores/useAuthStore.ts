import { defineStore } from "pinia";
import { Ref, ref } from "vue";
import axios from "axios";
import { UserAttributes } from "../interfaces/AuthAttributes";

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
  }

  function cleanup() {
    token.value = null;
    isAuthenticated.value = false;
    data.value = null;
    count.value = {};
    categories.value = [];
    localStorage.clear();
    axios.defaults.headers.common["Authorization"] = undefined;
  }

  return {
    isAuthenticated,
    cleanup,
    token,
  };
});

export default useAuthStore;
