<script setup lang="ts">
import { Ref, ref, VNodeRef, watch } from "vue";
import { Field } from "vee-validate";
import { VTextField } from "vuetify/components";
import useDisabled from "@/composables/useDisabled";

const inputRef: Ref<VNodeRef | undefined> = ref();
const showPassword = ref(false);
const type: Ref<string | undefined> = ref();
const appendInnerIcon: Ref<string | undefined> = ref();

const props = defineProps<{
  type?: string;
  disabled?: boolean;
  name: string;
}>();

const emits = defineEmits<{
  (e: "click:appendInner", v: unknown): void;
}>();

const { disabled } = useDisabled.inject(props);

watch(
  showPassword,
  (show) => {
    console.log("watching password type textfield");
    if (props.type === "password") {
      if (show) {
        type.value = "text";
        appendInnerIcon.value = "mdi-eye";
      } else {
        type.value = "password";
        appendInnerIcon.value = "mdi-eye-off";
      }
    } else {
      type.value = props.type;
      appendInnerIcon.value = undefined;
    }
  },
  { immediate: true }
);

function clickAppendInner(...args: unknown[]) {
  console.log("append inner click fn");
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
  <Field :name="name" v-slot="{ field, errors }">
    <v-text-field
      v-bind="{ ...field, ...$attrs }"
      ref="inputRef"
      variant="outlined"
      density="compact"
      color="primary"
      :error-messages="errors"
      :append-inner-icon="appendInnerIcon"
      :type="type"
      @click:append-inner="clickAppendInner"
      :disabled="disabled"
    />
  </Field>
</template>

<style scoped></style>
