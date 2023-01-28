<script setup lang="ts">
import useAlertStore from "@/stores/useAlertStore";
import { storeToRefs } from "pinia";

const { show, timeout, color, text } = storeToRefs(useAlertStore());
</script>

<template>
  <v-snackbar v-model="show" :timeout="timeout" :color="color">
    {{ text }}
  </v-snackbar>
</template>

<style scoped></style>
