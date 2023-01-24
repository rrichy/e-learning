<template>
  <v-text-field
    v-bind="$props"
    ref="inputRef"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    variant="outlined"
    density="compact"
    color="primary"
  />
</template>

<script lang="ts">
import { VTextField } from "vuetify/components";

export default {
  extends: VTextField,
  props: {
    modelValue: {
      type: String,
      default: "",
    },
  },
  emits: ["update:modelValue"],
};
</script>

<style scoped></style>
