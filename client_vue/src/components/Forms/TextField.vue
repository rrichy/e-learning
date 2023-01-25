<template>
  <v-text-field
    v-bind="$props"
    ref="inputRef"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    variant="outlined"
    density="compact"
    color="primary"
    :append-inner-icon="computedAppendInnerIcon"
    :type="computedType"
    @click:append-inner="clickAppendInner"
  />
</template>

<script lang="ts">
import { VTextField } from "vuetify/components";

export default {
  extends: VTextField,
  data() {
    return { 
      showPassword: false,
    }
  },
  props: {
    modelValue: {
      type: String,
      default: "",
    },
  },
  computed: {
    computedAppendInnerIcon(): string | undefined {
      if (this.$props.type === "password") {
        return this.showPassword ? "mdi-eye" : "mdi-eye-off";
      } else {
        return undefined;
      }
    },
    computedType(): string {
      if (this.$props.type === "password") {
        return this.showPassword ? "text" : "password";
      } else {
        return this.$props.type;
      }
    },
  },
  methods: {
    clickAppendInner(...args: any) {
      if (this.$props.type === "password") {
        this.showPassword = !this.showPassword;
      } else {
        this.$emit("click:append-inner", args);
      }
    }
  },
  emits: ["update:modelValue", "click:append-inner"],
};
</script>

<style scoped></style>
