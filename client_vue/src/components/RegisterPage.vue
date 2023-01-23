<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthenticationStore } from "../stores/authentication";

const auth = useAuthenticationStore();
const router = useRouter();

if (auth.isAuthenticated) {
  router.replace("/");
}

const state = ref({
  username: "",
  password: "",
  confirm_password: "",
  birthday: null,
});

function handleSubmit(e: Event) {
  e.preventDefault();

  console.log(state.value);
}
</script>

<template>
  <form @submit="handleSubmit">
    <input
      v-model="state.username"
      type="text"
      name="username"
    >
    <input
      v-model="state.password"
      type="password"
      name="password"
    >
    <input
      v-model="state.confirm_password"
      type="password"
      name="confirm_password"
    >
    <input
      v-model="state.birthday"
      type="date"
      name="birthday"
    >
    <button>Register</button>
  </form>
  <router-link to="/login">
    Back to login
  </router-link>
</template>

<style scoped>
</style>
