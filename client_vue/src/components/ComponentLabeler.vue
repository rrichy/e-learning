<template>
  <div :class="containerClassName">
    <p class="text-body-2 font-weight-bold mb-2 text-black">
      {{ label }}
    </p>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{
  label: string;
  stacked?: boolean;
}>();

let containerClassName = "w-100 d-flex flex-column";

if (!props.stacked) containerClassName += " flex-md-row";
</script>

<style scoped>
p::before {
  content: "";
  height: 100%;
  padding-right: 8px;
  border-left: 3px solid #00b4aa;
}
</style>