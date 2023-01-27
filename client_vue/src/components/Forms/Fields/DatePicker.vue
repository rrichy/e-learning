<script setup lang="ts">
import useInjectables from "@/composables/useInjectables";
import Datepicker, { VueDatePicker } from "@vuepic/vue-datepicker";
import { computed } from "vue";

type Value = VueDatePicker["modelValue"];

const { attrs, injectedValue, injectedChange } = useInjectables<Value>();

const props = defineProps<{
  modelValue?: Value;
  errors?: string[];
}>();

const emits = defineEmits<{
  (e: "update:modelValue", v: Value): void;
}>();

const value = computed<Value>(() => props.modelValue || injectedValue?.value);

function updateModelValue(e: Value) {
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
