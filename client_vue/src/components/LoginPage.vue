<script setup lang="ts">
import { useAlertStore } from "@/stores/alert";
import { ref, Ref } from "vue";
import { useRouter } from "vue-router";
import { CredentialInterface } from "../interfaces/UserInterface";
import { useAuthenticationStore } from "../stores/authentication";

const auth = useAuthenticationStore();
const { successAlert, errorAlert } = useAlertStore();
const router = useRouter();

const { mutate } = auth.loginMutation();
const form = ref<HTMLFormElement>();

if (auth.isAuthenticated) {
  router.replace("/");
}

const state: Ref<CredentialInterface> = ref({
  email: "",
  password: "",
});

function handleSubmit(e: Event) {
  e.preventDefault();
  mutate(state.value, {
    onSuccess: (res: any) => {
      successAlert(res.data.message);
      auth.getAuthData();
      router.replace("/");
    },
    onError: (e: any) => {
      state.value = {
        email: "",
        password: "",
      };
      errorAlert(e.response.data.message);
    },
  });
}
</script>

<template>
  <h1>Login</h1>
  <v-form ref="form" @submit="handleSubmit">
    <v-text-field
      v-model="state.email"
      label="User ID（登録メールアドレス）"
      variant="outlined"
    ></v-text-field>
    <v-text-field
      v-model="state.password"
      label="パスワード"
      variant="outlined"
      type="password"
    ></v-text-field>
    <v-btn type="submit">Login</v-btn>
  </v-form>
  <router-link to="/register">Register</router-link>
</template>

<style scoped>
</style>
