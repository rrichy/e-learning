<template>
  <div>
    <Datepicker
      v-bind="$props"
      :value="modelValue"
      @update:model-value="$emit('update:model-value', $event)"
    />
    <div class="v-input__details">
      <v-messages active :messages="errors[0]" />
    </div>
  </div>
</template>

<script lang="ts">
import Datepicker, { VueDatePicker } from "@vuepic/vue-datepicker";
import { PropType } from "vue";

export default {
  extends: Datepicker,
  components: {
    Datepicker,
  },
  props: {
    modelValue: {
      type: [String, Date, Array, Object, Number] as PropType<
        VueDatePicker["modelValue"]
      >,
      default: null,
    },
    errors: {
      type: Array as PropType<string[]>,
      default() {
        return [];
      },
    }
  },
  emits: ["update:model-value"],
};
</script>

<style scoped>
.v-input__details {
  padding-inline-start: 16px;
  padding-inline-end: 16px;
}
</style>
