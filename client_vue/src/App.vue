<script setup lang="ts">
import FooterComponent from "@/components/FooterComponent.vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import AppBar from "./components/AppBar.vue";
import PreviewDialog from "./components/PreviewDialog.vue";
import SnackbarPrompt from "./components/SnackbarPrompt.vue";
import useAuthStore from "./stores/useAuthStore";

const { isAuthenticated } = storeToRefs(useAuthStore());
const router = useRouter();

router.beforeEach((to, from) => {
  const toName = to.name?.toString() || "";
  const fromName = from.name?.toString || "";
  console.log({ toName, fromName });
  if (isAuthenticated.value) {
    if (["login", "register", "forgot-password"].includes(toName)) {
      return { name: "root" };
    }
  } else {
    // not authenticated and goes to guarded routes
    if (!["login", "register", "rules", "forgot-password"].includes(toName)) {
      return { name: "login" };
    }
  }
});
</script>

<template>
  <v-app>
    <AppBar />
    <v-main>
      <router-view />
    </v-main>
    <FooterComponent />
    <PreviewDialog />
    <SnackbarPrompt />
  </v-app>
</template>

<style scoped>
.v-container {
  min-height: 100%;
}
/* .logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
} */
</style>
