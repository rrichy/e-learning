<script setup lang="ts">
import FooterComponent from "@/components/FooterComponent.vue";
import { useAlertProvide } from "./hooks/useAlert";

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
