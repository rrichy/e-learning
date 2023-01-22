<!-- eslint-disable prettier-vue/prettier -->
<template>
  <v-snackbar v-model="alertProps.show" :timeout="alertProps.timeout" :color="alertProps.color">
    {{ alertProps.text }}
  </v-snackbar>
</template>

<script setup lang="ts">
import { useAlertStore } from "@/stores/alert";

const alertProps = useAlertStore();
// eslint-disable-next-line prettier-vue/prettier
</script>

<style scope>
</style>
