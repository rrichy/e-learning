<script setup lang="ts">
import { ItemAttributes } from "@/interfaces/ItemAttributes";
import useItemStore from "@/stores/useItemStore";
import { useField } from "vee-validate";
import { computed, Ref, ref, toRef, VNode } from "vue";
import useDisabled from "@/composables/useDisabled";

const selectRef: Ref<VNode | undefined> = ref();

const props = defineProps<{
  items?: ItemAttributes[];
  disabled?: boolean;
  name: string;
}>();

const { storedItems } = useItemStore();
const { value, handleChange, errorMessage } = useField(toRef(props, "name"));
const { disabled } = useDisabled.inject(props);

const items = computed(() => props.items || storedItems[props.name] || []);
</script>

<template>
  <v-select
    ref="selectRef"
    :model-value="value"
    @update:model-value="handleChange"
    :items="items"
    item-title="name"
    item-value="id"
    variant="outlined"
    density="compact"
    color="primary"
    :error-messages="errorMessage"
    :item-props="true"
    :disabled="disabled"
    :name="name"
  />
</template>

<style scoped></style>
