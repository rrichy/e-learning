<script setup lang="ts">
import useDisabled from "@/composables/useDisabled";
import Datepicker, { VueDatePicker } from "@vuepic/vue-datepicker";
import { ja } from "date-fns/locale";
import { useField } from "vee-validate";
import { computed, toRef } from "vue";

type Value = VueDatePicker["modelValue"];

const props = defineProps<{
  disabled?: boolean;
  name: string;
}>();

const { value, handleChange, errorMessage } = useField<Value>(
  toRef(props, "name")
);
const { disabled } = useDisabled.inject(props);

const className = computed(() => (errorMessage.value ? "v-input--error" : ""));
</script>

<template>
  <div :class="className">
    <Datepicker
      :model-value="value"
      @update:model-value="handleChange"
      v-bind="$attrs"
      locale="ja"
      :format-locale="ja"
      :disabled="disabled"
      :name="name"
    />
    <div class="v-input__details">
      <v-messages active :messages="errorMessage" />
    </div>
  </div>
</template>

<style scoped>
.v-input__details {
  padding-inline-start: 16px;
  padding-inline-end: 16px;
}
</style>
