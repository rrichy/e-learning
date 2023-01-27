<script setup lang="ts">
import useInjectables from "@/composables/useInjectables";
import { computed, Ref, ref, VNodeRef } from "vue";
import { VTextField } from "vuetify/components";

type Value = string | number | undefined;

const { attrs, name, injectedValue, injectedChange } = useInjectables<Value>();
const inputRef: Ref<VNodeRef | undefined> = ref();
const showPassword = ref(false);

const props = defineProps<{
  modelValue?: Value;
  type?: string;
}>();

const emits = defineEmits<{
  (e: "update:modelValue", v: Value): void;
  (e: "click:appendInner", v: unknown): void;
}>();

function updateModelValue(v: Value) {
  emits("update:modelValue", v);
  if (injectedChange) {
    injectedChange(v);
  }
}

const value = computed(() => props.modelValue || injectedValue?.value);

const type = computed(() => {
  if (props.type === "password") {
    return showPassword.value ? "text" : "password";
  } else {
    return attrs.type as string | undefined;
  }
});

const appendInnerIcon = computed(() => {
  if (props.type === "password") {
    return showPassword.value ? "mdi-eye" : "mdi-eye-off";
  } else {
    return undefined;
  }
});

function clickAppendInner(...args: unknown[]) {
  if (props.type === "password") {
    showPassword.value = !showPassword.value;
  } else {
    emits("click:appendInner", args);
  }
}

defineExpose({
  inputRef,
});
</script>

<template>
  <v-text-field
    ref="inputRef"
    :model-value="value"
    @update:model-value="updateModelValue($event)"
    variant="outlined"
    density="compact"
    color="primary"
    :name="name"
    :append-inner-icon="appendInnerIcon"
    :type="type"
    @click:append-inner="clickAppendInner"
  />
</template>

<style scoped></style>
