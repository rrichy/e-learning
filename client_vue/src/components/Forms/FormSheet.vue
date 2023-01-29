<script setup lang="ts">
defineProps<{ title?: string }>();
</script>

<template>
  <v-container class="d-flex justify-center">
    <v-sheet elevation="1" outlined width="100%" max-width="600">
      <div v-if="title" class="v-sheet__title">マイページ</div>
      <div class="v-sheet__content pa-4 pa-sm-10">
        <slot />
      </div>
    </v-sheet>
  </v-container>
</template>

<style scoped>
.v-container {
  min-height: fit-content;
}
</style>
