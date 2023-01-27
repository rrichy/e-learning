<script setup lang="ts">
import { useAlertProvide } from "@/composables/useAlert";
const { show, timeout, color, text } = useAlertProvide();
</script>

<template>
  <v-snackbar v-model="show" :timeout="timeout" :color="color">
    {{ text }}
  </v-snackbar>
</template>

<style scoped></style>
