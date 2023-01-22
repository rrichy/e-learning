<script setup lang="ts">
import { useAlertStore } from "@/stores/alert";

const alertProps = useAlertStore();
</script>

<template>
  <v-snackbar v-model="alertProps.show" :timeout="alertProps.timeout" :color="alertProps.color">
    {{ alertProps.text }}
  </v-snackbar>
</template>

<style scope>
</style>
