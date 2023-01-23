<script setup lang="ts">
import { useAlertStore } from "@/stores/alert";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthenticationStore } from "../stores/authentication";

const auth = useAuthenticationStore();
const { successAlert, errorAlert } = useAlertStore();
const router = useRouter();
const { mutate } = auth.logoutMutation();

if (!auth.isAuthenticated) {
  console.log("not authenticated");
  router.replace("/login");
}

defineProps<{ msg: string }>();

const count = ref(0);

function logout() {
  mutate(null, {
    onSuccess: () => successAlert("Successfully logged out"),
    onError: () => {
      errorAlert("Failed to log out properly");
      console.log("errorsssss");
    },
    onSettled: () => {
      router.replace("/login");
    },
  });
}
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button
      type="button"
      @click="count++"
    >
      count is {{ count }}
    </button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a
      href="https://vuejs.org/guide/quick-start.html#local"
      target="_blank"
    >create-vue</a>, the
    official Vue + Vite starter
  </p>
  <p>
    Install
    <a
      href="https://github.com/johnsoncodehk/volar"
      target="_blank"
    >Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">
    Click on the Vite and Vue logos to learn more
  </p>
  <button @click="logout">
    Logout
  </button>
  <p>{{ auth.token }}</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
