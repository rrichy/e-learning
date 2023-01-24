<script setup lang="ts">
import FooterComponent from "@/components/FooterComponent.vue";
import { useAlertProvide } from "./composables/useAlert";
import { useRouter } from "vue-router";
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

const { alertProps } = useAlertProvide();
</script>

<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
    <FooterComponent />
    <v-snackbar
      v-model="alertProps.show"
      :timeout="alertProps.timeout"
      :color="alertProps.color"
    >
      {{ alertProps.text }}
    </v-snackbar>
  </v-app>
</template>

<style scoped>
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
