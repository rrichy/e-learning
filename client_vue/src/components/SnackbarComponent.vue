<script setup lang="ts">
import useAlert from "@/composables/useAlert";

const { show, timeout, color, text } = useAlert.provide();
</script>

<template>
  <slot />
  <v-snackbar v-model="show" :timeout="timeout" :color="color">
    {{ text }}
  </v-snackbar>
</template>

<style scoped></style>
