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

<script setup lang="ts">
import { computed, inject, Ref, ref, useAttrs, VNodeRef } from "vue";
import { VTextField } from "vuetify/components";

const inputRef: Ref<VNodeRef | undefined> = ref();
const attrs = useAttrs();
const showPassword = ref(false);

const props = defineProps<{
  modelValue?: string | number;
  type?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", v?: string | number): void;
  (e: "click:appendInner", v: any): void;
}>();

const name = attrs.name as string | undefined;
const injectedValue = inject("value:" + name, undefined) as
  | Ref<string | number | undefined>
  | undefined;

const injectedChange = inject("update:" + name, undefined) as
  | ((v?: string | number) => void)
  | undefined;

function updateModelValue(v?: string | number) {
  emit("update:modelValue", v);
  if (injectedChange) {
    injectedChange(v);
  }
}

const appendInnerIcon = computed(() => {
  if (props.type === "password") {
    return showPassword.value ? "mdi-eye" : "mdi-eye-off";
  } else {
    return undefined;
  }
});

const value = computed<string | number | undefined>(() => {
  if (props.modelValue) {
    return props.modelValue;
  } else if (injectedValue) {
    return injectedValue?.value;
  }
  return undefined;
});

const type = computed<string | undefined>(() => {
  if (props.type === "password") {
    console.log(showPassword.value ? "text" : "password");
    return showPassword.value ? "text" : "password";
  } else {
    return attrs.type as string | undefined;
  }
});

function clickAppendInner(...args: any) {
  if (props.type === "password") {
    console.log("new value: ", !showPassword.value);
    showPassword.value = !showPassword.value;
  } else {
    emit("click:appendInner", args);
  }
}

defineExpose({
  inputRef,
});
</script>

<style scoped></style>
