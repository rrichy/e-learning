<script setup lang="ts">
import useInjectables from "@/composables/useInjectables";
import { ItemAttributes } from "@/interfaces/ItemAttributes";
import { computed, Ref, ref, VNode } from "vue";

type Value = number | undefined;

const { injectedItems, injectedValue, injectedChange, injectedDisabled } =
  useInjectables<Value>();
const selectRef: Ref<VNode | undefined> = ref();

const props = defineProps<{
  modelValue?: Value;
  items?: ItemAttributes[];
  disabled?: boolean;
}>();

const emits = defineEmits<{
  (e: "update:modelValue", v: Value): void;
}>();

const items = computed(() => props.items || injectedItems || []);
const value = computed(() => props.modelValue || injectedValue?.value);
const disabled = computed(() => props.disabled || injectedDisabled);

function updateModelValue(v: Value) {
  emits("update:modelValue", v);
  if (injectedChange) {
    injectedChange(v);
  }
}
</script>

<template>
  <v-select
    ref="selectRef"
    :model-value="value"
    @update:model-value="updateModelValue($event)"
    :items="items"
    item-title="name"
    item-value="id"
    variant="outlined"
    density="compact"
    color="primary"
    :item-props="true"
    :disabled="disabled"
  />
</template>

<style scoped></style>
