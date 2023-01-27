<script setup lang="ts">
import useInjectables from "@/composables/useInjectables";
import { computed, Ref, ref, toRef, VNodeRef } from "vue";
import { useField } from "vee-validate";
import { VTextField } from "vuetify/components";

const inputRef: Ref<VNodeRef | undefined> = ref();
const showPassword = ref(false);

const props = defineProps<{
  type?: string;
  disabled?: boolean;
  name: string;
}>();

const emits = defineEmits<{
  (e: "click:appendInner", v: unknown): void;
}>();

const { disabled } = useInjectables(props);

const type = computed(() => {
  if (props.type === "password") {
    return showPassword.value ? "text" : "password";
  } else {
    return props.type as string | undefined;
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

const { errorMessage, value, handleChange } = useField(toRef(props, "name"));

defineExpose({
  inputRef,
});
</script>

<template>
  <v-text-field
    ref="inputRef"
    :model-value="value"
    @update:model-value="handleChange"
    variant="outlined"
    density="compact"
    color="primary"
    :error-messages="errorMessage"
    :name="name"
    :append-inner-icon="appendInnerIcon"
    :type="type"
    @click:append-inner="clickAppendInner"
    :disabled="disabled"
  />
</template>

<style scoped></style>
