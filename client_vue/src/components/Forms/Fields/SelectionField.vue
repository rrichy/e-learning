<script setup lang="ts">
import { ItemAttributes } from "@/interfaces/ItemAttributes";
import { computed, inject, Ref, ref, useAttrs, VNode } from "vue";

const selectRef: Ref<VNode | undefined> = ref();
const attrs = useAttrs();

const props = defineProps<{
  modelValue?: number;
  items?: ItemAttributes[];
}>();

const emits = defineEmits<{
  (e: "update:modelValue", v?: number): void;
}>();

const name = attrs.name as string | undefined;
const injectedItems = inject("items:" + name, undefined) as
  | ItemAttributes[]
  | undefined;

const injectedValue = inject("value:" + name, undefined) as
  | Ref<number | undefined>
  | undefined;

const injectedChange = inject("update:" + name, undefined) as
  | ((v?: number) => void)
  | undefined;

const items = computed<ItemAttributes[]>(
  () => props.items || injectedItems || []
);

const value = computed<number | undefined>(
  () => props.modelValue || injectedValue?.value
);

function updateModelValue(v?: number) {
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
  />
</template>

<style scoped></style>
