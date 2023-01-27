<script setup lang="ts">
import useInjectables from "@/composables/useInjectables";
import Datepicker, { VueDatePicker } from "@vuepic/vue-datepicker";
import { ja } from "date-fns/locale";
import { useField } from "vee-validate";
import { computed, toRef } from "vue";

type Value = VueDatePicker["modelValue"];

const props = defineProps<{
  errors?: string[];
  disabled?: boolean;
  name: string;
}>();

const { disabled } = useInjectables(props);

const { value, handleChange, errorMessage } = useField<Value>(
  toRef(props, "name")
);

const errors = computed<string[]>(() => {
  return props.errors || [];
});
</script>

<template>
  <div>
    <Datepicker
      :model-value="value"
      @update:model-value="handleChange"
      v-bind="$attrs"
      locale="ja"
      :format-locale="ja"
      :disabled="disabled"
      :name="name"
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
