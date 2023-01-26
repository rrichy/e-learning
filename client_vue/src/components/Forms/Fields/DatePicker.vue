<script setup lang="ts">
import Datepicker, { VueDatePicker } from "@vuepic/vue-datepicker";
import { computed, inject, Ref, useAttrs } from "vue";

type DateType = VueDatePicker["modelValue"];

const attrs = useAttrs();
const props = defineProps<{
  modelValue?: DateType;
  errors?: string[];
}>();

const emits = defineEmits<{
  (e: "update:modelValue", v: DateType): void;
}>();

const name = attrs.name as string | undefined;
const injectedValue = inject("value:" + name, undefined) as
  | Ref<DateType>
  | undefined;

const injectedChange = inject("update:" + name, undefined) as
  | ((e: DateType) => void)
  | undefined;

const value = computed<DateType>(() => {
  return props.modelValue || injectedValue?.value;
});

function updateModelValue(e: DateType) {
  emits("update:modelValue", e);
  if (injectedChange) {
    injectedChange(e);
  }
}

const errors = computed<string[]>(() => {
  return props.errors || [];
});
</script>

<template>
  <div>
    <Datepicker
      :model-value="value"
      @update:model-value="updateModelValue"
      v-bind="attrs"
    />
    <!-- TODO: ERROR PROPS -->
    <div class="v-input__details">
      <v-messages active :messages="errors[0]" />
    </div>
  </div>
</template>

<style scoped>
.v-input__details {
  padding-inline-start: 16px;
  padding-inline-end: 16px;
}
</style>
