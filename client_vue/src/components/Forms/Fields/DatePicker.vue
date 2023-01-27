<script setup lang="ts">
import useInjectables from "@/composables/useInjectables";
import Datepicker, { VueDatePicker } from "@vuepic/vue-datepicker";
import { ja } from "date-fns/locale";
import { computed } from "vue";

type Value = VueDatePicker["modelValue"];

const { attrs, injectedValue, injectedChange, injectedDisabled } =
  useInjectables<Value>();

const props = defineProps<{
  modelValue?: Value;
  errors?: string[];
  disabled?: boolean;
}>();

const emits = defineEmits<{
  (e: "update:modelValue", v: Value): void;
}>();

const value = computed<Value>(() => props.modelValue || injectedValue?.value);
const disabled = computed(() => props.disabled || injectedDisabled);

function updateModelValue(e: Value) {
  console.log(e);
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
      locale="ja"
      :format-locale="ja"
      :disabled="disabled"
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
