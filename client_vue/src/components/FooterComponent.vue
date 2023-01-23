<template>
  <v-footer elevation="2">
    <v-row
      justify="center"
      class="text-body-2"
    >
      © {{ new Date().getFullYear() }} techhub
    </v-row>
  </v-footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
footer {
    height: 70px;
    max-height: 70px;
}
</style>