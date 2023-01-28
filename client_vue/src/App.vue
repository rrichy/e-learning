<script setup lang="ts">
import FooterComponent from "@/components/FooterComponent.vue";
import { useRouter } from "vue-router";
import ConfirmationComponent from "./components/ConfirmationComponent.vue";
import SnackbarComponent from "./components/SnackbarComponent.vue";
import { useAuthenticationStore } from "./stores/authentication";

const { isAuthenticated } = useAuthenticationStore();
const router = useRouter();

router.beforeEach((to, from) => {
  const toName = to.name?.toString() || "";
  const fromName = from.name?.toString || "";
  console.log({ toName, fromName });
  if (isAuthenticated()) {
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
    <v-app-bar elevation="1" />
    <v-main>
      <SnackbarComponent>
        <ConfirmationComponent>
          <router-view />
        </ConfirmationComponent>
      </SnackbarComponent>
    </v-main>
    <FooterComponent />
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
